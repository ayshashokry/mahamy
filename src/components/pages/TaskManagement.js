import React, { Component } from "react";
//Packages Importing
import { Button, Row, Col, Container } from "react-bootstrap";
//Images Importing
import NoTasksImg from "../../assets/images/Operating system-rafiki.png";
//components Importing
import AddSubTaskForm from "../forms/AddSubTaskForm";
import AddMainTaskForm from "../forms/AddMainTaskForm";
import AddTaskModal from "../modals/AddTaskModal";
import TaskTree from "../tasksSections/TaskTree";
import Media from "react-media";
import { notification, Input } from "antd";
//Redux Importing
import { getCategoriesList } from "../../redux/actions/CategoriesActions";
import { connect } from "react-redux";
import { getTasksList } from "../../redux/actions/TasksActions";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class TaskManagement extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      searchString: "",
      addTaskModalShow: false,
      renderModal: "main",
      showSubBtn: "hidden",
      selectedCategoryId: "",
      displayedTasks: this.props.Tasks,
    };
    this.content = React.createRef();
  }
  openAddTaskModal = (e) => {
    if (e.target.id === "main") {
      this.setState({
        renderModal: "main",
        addTaskModalShow: true,
      });
    } else {
      this.setState({
        renderModal: "sub",
        addTaskModalShow: true,
      });
    }
  };

  closeAddTaskModal = () => {
    setTimeout(() => {
      this.setState({
        addTaskModalShow: false,
      });
    }, 100);
  };
  onSelect = (id) => {
    let seleCatrg = this.props.FlatCategories.find((c) => c.id == id);
    if (id !== "" && seleCatrg.canManage == true) {
      this.setState({ showSubBtn: "visible" });
    } else {
      this.setState({ showSubBtn: "hidden" });
    }
    this.setState({ selectedCategoryId: id });
  };

  handleSearch = (event) => {
    var searchQuery = event.target.value.toLowerCase();
    this.setState({ searchString: event.target.value.toLowerCase() });

    var displayedTasks = this.props.Tasks.filter(function (el) {
      var searchValue = el.name.toLowerCase();

      return searchValue.indexOf(searchQuery) !== -1;
    });
    this.setState({
      displayedTasks: displayedTasks,
    });
  };

  // this.setState({ searchString: event.target.value.toLowerCase() }, () => {
  //   const filteredTasks = this.filterTasks(
  //     this.props.Tasks,
  //     this.state.searchString
  //   );
  //   this.props.getTasksList(filteredTasks);
  // });}

  // filterTasks = (tasks, queryParams) => {
  //   const { nameLike } = queryParams;
  //   let filteredTasks = tasks;
  //   if (nameLike)
  //     filteredTasks = filteredTasks.filter(t =>
  //       String(t.name).includes(nameLike)
  //     );

  //   return filteredTasks;
  // };

  confirmationAddCategory = () => {
    const args = {
      description: "تم إضافة مهمة رئيسية بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  confirmationAddTask = () => {
    const args = {
      description: "تم إضافة مهمة فرعية بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  handleClickAway = (e) => {
    this.setState({ showSubBtn: "hidden" });
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    let tasksRender = this.props.Categories ? (
      <TaskTree
        onClickAway={this.onClickAway}
        searchString={this.state.searchString}
        onSelect={this.onSelect}
        displayedTasks={this.state.displayedTasks}
      />
    ) : (
      <div className="noTasksdiv">
        <img src={NoTasksImg} alt="No Tasks Found" className="NotaskImg" />
        <h5 className="pt-5">لا يوجد مهام بعد</h5>
      </div>
    );

    return (
      <Container fluid>
        <div className="pt-2">
          <Row>
            <Media query="(max-width: 768px)">
              {(matches) =>
                matches ? (
                  <Col sm={12} md={6}>
                    {this.props.admin === "admin" ? (
                      <Button
                        className="addMainTaskBtn"
                        onClick={this.openAddTaskModal}
                        id="main"
                      >
                        إضافة مهمة رئيسية
                      </Button>
                    ) : null}
                    <Button
                      style={{ visibility: this.state.showSubBtn }}
                      className="addSubTaskBtn"
                      onClick={this.openAddTaskModal}
                      id="sub"
                    >
                      إضافة مهمة فرعية
                    </Button>
                  </Col>
                ) : (
                  <Col sm={12} md={6}>
                    {this.props.admin === "admin" ? (
                      <Button
                        className="addMainTaskBtn"
                        onClick={this.openAddTaskModal}
                        id="main"
                      >
                        إضافة مهمة رئيسية جديدة
                      </Button>
                    ) : null}{" "}
                    {this.props.admin !== "admin" ? (
                      <Button
                        style={{ visibility: this.state.showSubBtn }}
                        className="addSubTaskBtn"
                        onClick={this.openAddTaskModal}
                        id="sub"
                      >
                        إضافة مهمة فرعية جديدة
                      </Button>
                    ) : null}
                  </Col>
                )
              }
            </Media>
            <Col sm={12} md={6} className="taskSearchInput">
              <Row className="searchForm">
                <Input
                  type="text"
                  onChange={this.handleSearch}
                  placeholder="البحث بواسطة اسم المهمة"
                />
                <Button className="searchIconBtn">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Row>
            </Col>
            <AddTaskModal
              show={this.state.addTaskModalShow}
              onHide={this.closeAddTaskModal}
              title={
                this.state.renderModal === "main"
                  ? "إضافة مهمة رئيسية جديدة"
                  : "إضافة مهمة فرعية جديدة"
              }
            >
              {this.state.renderModal === "main" ? (
                <AddMainTaskForm
                  confirmationAddCategory={this.confirmationAddCategory}
                  onHide={this.closeAddTaskModal}
                />
              ) : (
                <AddSubTaskForm
                  confirmationAddTask={this.confirmationAddTask}
                  selectedCategoryId={this.state.selectedCategoryId}
                  onHide={this.closeAddTaskModal}
                />
              )}
            </AddTaskModal>
          </Row>
        </div>

        <div className="TaskManagementPage">{tasksRender}</div>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  Categories: state.Categories.Categories,
  Tasks: state.Tasks.TeamsTasks,
  FlatCategories: state.Categories.FlatCategories,
  admin: state.auth.admin,
});
const mapDispatchToProps = {
  getCategoriesList,
  getTasksList,
};
export default connect(mapStateToProps, mapDispatchToProps)(TaskManagement);
