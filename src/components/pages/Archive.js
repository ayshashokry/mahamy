import React, { Component } from "react";

//Packages Importing
import { Container, Table, Button } from "react-bootstrap";
import { Pagination, ConfigProvider, Card, Row, Col, notification } from "antd";
import Media from "react-media";

//Components Importing
import TaskDetails from "../modals/TaskDetails";
import FilterSearchTasks from "../tasksSections/FilterSearchTasks";
import { connect } from "react-redux";
import {
  getTaskDetails,
  clearTaskDetails,
  getOutputsList,
} from "../../redux/actions/TasksActions";
import moment from "moment-hijri";
import { dearchiveTask, getArchivedTasks } from "../../api/tasksApi";
import PreLoading from "../layout/PreLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      //selectedStartDate: moment(),
      finishDate: "",
      //selectedFinishDate: moment(),
      deliverTime: [
        { name: "متأخر", id: 1 },
        { name: "اليوم", id: 2 },
        { name: "غدا", id: 3 },
      ],
      selectedCategory: 0,
      selectedPriority: 0,
      selectedStatus: undefined,
      searchString: "",
      showDetails: false,
      cardId: "",
      cardName: "",
      pageNumber: 1,
      ArchivedTasks: [],
      pagesCount: 0,
      loading: false,
      archiveNoDate: false,
    };
  }
  openDetailsModal = (e) => {
    this.setState({
      showDetails: true,
      cardId: e.target.id,
      cardName: e.target.name,
    });
    this.props.getTaskDetails(e.target.id);
  };
  closeDetailsModal = () => {
    this.setState({ showDetails: false, cardId: "" });
    this.props.clearTaskDetails();
  };

  dearchiveTask = async (taskId) => {
    let { ArchivedTasks } = this.state;
    try {
      await dearchiveTask(taskId);
      const archivedTasks = ArchivedTasks.filter((t) => t.id !== taskId);
      this.setState({ ArchivedTasks: archivedTasks });
      notification.success({
        description: "تم إعادة تفعيل المهمة بنجاح",
        duration: 5,
      });
    } catch (error) {
      notification.error({
        description: "حدث خطأ.. الرجاء المحاولة لاحقاً",
        duration: 5,
      });
    }
  };

  handleSearchType = (e) => {
    this.setState({ searchString: e.target.value }, () => {
      this.getFilteredArchivedTasks();
    });
  };

  handleSelectCategory = (value, e) => {
    this.setState({ [e.name]: e.id }, () => {
      this.getFilteredArchivedTasks();
    });
  };

  handleSelectPriority = (value, e) => {
    this.setState({ [e.name]: e.id }, () => {
      this.getFilteredArchivedTasks();
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.getOutputsList();
    this.getFilteredArchivedTasks();
  }

  getFilteredArchivedTasks = async () => {
    this.setState({ loading: true });
    const request = {};
    if (this.state.selectedPriority)
      request.priorityId = this.state.selectedPriority;
    if (this.state.searchString) request.nameLike = this.state.searchString;
    if (this.state.selectedCategory)
      request.categoryId = this.state.selectedCategory;

    if (this.state.startDate)
      request.fromArchivingDate = moment(this.state.startDate)
        .add(1, "day") // for hijri date correction
        .toISOString();
    if (this.state.finishDate)
      request.toArchivingDate = moment(this.state.finishDate)
        .add(1, "day")
        .toISOString();
    if ((await getArchivedTasks(1, 10, request)).items.length == 0) {
      this.setState({ loading: false, archiveNoDate: true, ArchivedTasks: [] });
    } else {
      this.setState({
        ArchivedTasks: (await getArchivedTasks(1, 10, request)).items,
        pagesCount: (await getArchivedTasks(1, 10, request)).pagesCount,
        loading: false,
        archiveNoDate: false,
      });
    }
  };

  onChange = async (page, pageSize) => {
    // this.setState({ loading: true });
    this.setState({ pageNumber: page });
    const request = {};

    if (this.state.selectedPriority)
      request.priorityId = this.state.selectedPriority;
    if (this.state.searchString) request.nameLike = this.state.searchString;
    if (this.state.selectedCategory)
      request.categoryId = this.state.selectedCategory;
    if (this.state.startDate)
      request.fromArchivingDate = moment(this.state.startDate)
        .add(1, "day") // for hijri date correction
        .toISOString();
    if (this.state.finishDate)
      request.toArchivingDate = moment(this.state.finishDate)
        .add(1, "day")
        .toISOString();
    if ((await getArchivedTasks(page, pageSize, request)).items.length == 0) {
      this.setState({ loading: false, archiveNoDate: true, ArchivedTasks: [] });
    } else {
      this.setState({
        ArchivedTasks: (await getArchivedTasks(page, pageSize, request)).items,
        pagesCount: (await getArchivedTasks(page, pageSize, request))
          .pagesCount,
        loading: false,
        archiveNoDate: false,
      });
    }
  };

  handleStartDate = (date) => {
    this.setState({ startDate: date }, () => {
      this.getFilteredArchivedTasks();
    });
  };

  handleFinishDate = (date) => {
    this.setState({ finishDate: date }, () => {
      this.getFilteredArchivedTasks();
    });
  };

  render() {
    return (
      <>
        <Container fluid>
          <FilterSearchTasks
            startDate={this.state.startDate}
            //selectedStartDate={this.state.selectedStartDate}
            finishDate={this.state.finishDate}
            //selectedFinishDate={this.state.selectedFinishDate}
            handleFinishDate={this.handleFinishDate}
            handleStartDate={this.handleStartDate}
            value={this.state.searchString}
            handleSearch={this.handleSearchType}
            pageType="archive"
            selectedCategory={this.state.selectedCategory}
            selectedPriority={this.state.selectedPriority}
            handleSelectCategory={this.handleSelectCategory}
            handleSelectPriority={this.handleSelectPriority}
          />

          <div className="ArchivePage mt-4">
            {this.state.loading ? <PreLoading /> : ""}
            {this.state.ArchivedTasks.length !== 0 && !this.state.loading ? (
              <>
                <Media query="(max-width: 768px)">
                  {(matches) =>
                    matches ? (
                      this.state.ArchivedTasks.map((task, index) => (
                        <div className="mt-4">
                          {" "}
                          <Card className="TaskCard">
                            <Row>
                              <Col xs={{ span: 12 }} className="maintaskname">
                                {this.props.Categories.map((category, index) =>
                                  category.id === task.categoryId ? (
                                    <h6 key={index}>{category.name}</h6>
                                  ) : null
                                )}
                              </Col>
                              <Col xs={{ span: 12 }} className="taskpriority">
                                <span
                                  style={{
                                    backgroundColor:
                                      this.props.priority === 1
                                        ? "#e1fce2"
                                        : this.props.priority === 2
                                        ? "#fce1e1"
                                        : "#ecd6b1",
                                    color:
                                      this.props.priority === 1
                                        ? "#016606"
                                        : this.props.priority === 2
                                        ? "#800202"
                                        : "#99630a",
                                  }}
                                >
                                  {task.priorityId === 1
                                    ? "عادي"
                                    : task.priorityId === 2
                                    ? "عاجل "
                                    : "سري"}
                                </span>
                              </Col>
                            </Row>
                            <h6 className="subtaskname">{task.name}</h6>
                            <div className="taskpriority">
                              <p className="dateTitle pt-3">
                                <FontAwesomeIcon
                                  className="ml-2"
                                  icon={faCalendar}
                                />
                                تاريخ الأرشفة
                              </p>
                              <h6 className="Carddate">{task.finishedOn}</h6>
                            </div>
                            <Row>
                              {" "}
                              <Col span={12} className="text-right">
                                <Button
                                  id={task.id}
                                  name={task.name}
                                  className="commentsBtn"
                                  onClick={this.openDetailsModal}
                                >
                                  عرض
                                </Button>
                              </Col>
                              <Col span={12} className="m-auto">
                                {task.canManage ? (
                                  <Button
                                    id={task.id}
                                    name={task.name}
                                    className="detailsBtn"
                                    onClick={() => this.dearchiveTask(task.id)}
                                  >
                                    تفعيل
                                  </Button>
                                ) : (
                                  <></>
                                )}
                              </Col>
                            </Row>
                          </Card>
                        </div>
                      ))
                    ) : (
                      <Table className="selectedTasksTable  ">
                        <thead>
                          <tr>
                            <th>العمليات</th>
                            <th>تاريخ الإنتهاء</th>
                            <th>الأولوية</th>
                            <th>المخرجات</th>
                            <th>تفاصيل</th>
                            <th>اسم المهمة الرئيسية</th>
                            <th>اسم المهمة الفرعية/ رقم المعاملة</th>
                            <th>م</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.ArchivedTasks.map((task, index) => (
                            <>
                              <tr
                                key={index}
                                style={{
                                  borderBottom: "1px solid #d4d6de",
                                }}
                              >
                                <td>
                                  {task.canManage ? (
                                    <Button
                                      id={task.id}
                                      name={task.name}
                                      className="detailsBtn"
                                      onClick={() =>
                                        this.dearchiveTask(task.id)
                                      }
                                    >
                                      تفعيل
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  <Button
                                    id={task.id}
                                    name={task.name}
                                    className="detailsBtn"
                                    onClick={this.openDetailsModal}
                                  >
                                    عرض
                                  </Button>
                                </td>
                                <td>{task.finishedOn}</td>
                                <td>
                                  {task.priorityId === 1
                                    ? "عادي"
                                    : task.priorityId === 2
                                    ? "عاجل "
                                    : "سري"}
                                </td>
                                <td>
                                  {task.outputs && task.outputs.length !== 0
                                    ? task.outputs
                                        .map((o) =>
                                          this.props.OutPuts.filter(
                                            (out) => out.id === o
                                          )[0] !== undefined
                                            ? this.props.OutPuts.filter(
                                                (out) => out.id === o
                                              )[0].name
                                            : "----"
                                        )
                                        .join("/")
                                    : "----"}

                                  {/* {task.outputs.map((att) =>
                              this.props.OutPuts.map((out) =>
                                out.id === att ? <span>/{out.name} </span> : null
                              )
                            )} */}
                                </td>
                                <td>...... {task.description.slice(0, 15)}</td>
                                <td>
                                  {this.props.Categories.map(
                                    (category, index) =>
                                      category.id === task.categoryId
                                        ? category.name
                                        : null
                                  )}
                                </td>
                                <td>{task.name}</td>
                                <td>
                                  {" "}
                                  {10 * (this.state.pageNumber - 1) + index + 1}
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </Table>
                    )
                  }
                </Media>
                <ConfigProvider direction="ltr">
                  <Pagination
                    className="pt-3"
                    pageSize={10}
                    total={this.state.pagesCount * 10}
                    // total={100}
                    defaultCurrent={1}
                    onChange={this.onChange}
                  />
                </ConfigProvider>
              </>
            ) : null}
            {this.state.archiveNoDate ? (
              <div
                style={{ position: "relative" }}
                className="NoDataPage"
                fluid
              >
                <h3
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: "40%",
                  }}
                  className="NoDataH3 NoDataH3Mob"
                >
                  لا توجد مهام منتهية
                </h3>
              </div>
            ) : (
              ""
            )}
          </div>
          <TaskDetails
            archive
            name={this.state.cardName}
            onHide={this.closeDetailsModal}
            show={this.state.showDetails}
            id={this.state.cardId}
          />
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  pagesCount: state.Tasks.pagesCount,
  OutPuts: state.Tasks.OutPuts,
  Status: state.Tasks.Status,
  Priorities: state.Tasks.Priorities,
  Categories: state.Categories.FlatCategories,
});
const mapDispatchToProps = {
  getTaskDetails,
  clearTaskDetails,
  getOutputsList,
};
export default connect(mapStateToProps, mapDispatchToProps)(Archive);
