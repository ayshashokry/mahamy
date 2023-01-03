import React, { Component } from "react";
import { Select, Input } from "antd";
import { Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import SearchHeader from "../layout/SearchHeader";
import {
  getScheduleCards,
  getTeamsCards,
} from "../../redux/actions/StatusActions";
import { getTeamTasksList } from "../../redux/actions/TasksActions";
import { getEmpList, clearAllEmp } from "../../redux/actions/GroupsActions";
import DatePicker from "@deskpro/react-datepicker-hijri";
import moment from "moment-hijri";
import Media from "react-media";
import { getManagedGroupsWithUsers } from "../../api/groupsApi";
import "@deskpro/react-datepicker-hijri/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getAppsList } from "../../api/appsApi";
const deliverTime = [
  { name: "متأخر", id: 1 },
  { name: "اليوم", id: 2 },
  { name: "غدا", id: 3 },
];

class FilterSearchTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        nameLike: "",
        categoryId: 0,
        priorityId: 0,
        employeeId: 0,
        status: 0,
        appId: 0,
        deliveryTime: "",
        fromDueDate: undefined,
        toDueDate: undefined,
        allEmployees: [],
        employeesTasks: [],
      },
    };
  }

  async componentDidMount() {
    await this.props.getTeamTasksList();
    let data = (await getManagedGroupsWithUsers())
      .map((x) => x.employees)
      .flat();

    let employeesTasks = [];
    this.props.TeamsTasks.forEach((t) => {
      const employees = t.employees;
      employees.forEach((e) => employeesTasks.push({ ...t, ...e }));
    });

    let apps = (await getAppsList()).results.sort((a, b) => a.id - b.id);

    this.setState({
      allEmployees: data.reduce((unique, o) => {
        if (
          !unique.some(
            (obj) =>
              obj.id === o.id &&
              obj.name === o.name &&
              obj.username === o.username
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []),
      employeesTasks,
      apps,
    });
  }

  handleChangeApp = (value, e, type) => {
    this.setState(
      {
        formValues: { ...this.state.formValues, [e.name]: e.value },
      },
      () => {
        if (type === "teams") {
          const { TeamsTasks } = this.props;
          const { employeesTasks, formValues } = this.state;
          const refinedTasks = formValues.employeeId
            ? employeesTasks.filter(
                (t) => t.employeeId === Number(formValues.employeeId)
              )
            : TeamsTasks;
          const filteredTasks = this.filterTasks(
            refinedTasks,
            this.state.formValues
          );
          //this.props.getTeamsCards(filteredTasks, this.props.Status);
          this.props.getScheduleCards(filteredTasks);
        } else {
          const filteredTasks = this.filterTasks(
            this.props.Tasks,
            this.state.formValues
          );
          this.props.getScheduleCards(filteredTasks);
        }
      }
    );
  };

  handleChangeTeams = (value, e) => {
    this.setState(
      { formValues: { ...this.state.formValues, [e.name]: e.id } },
      () => {
        const { TeamsTasks } = this.props;
        const { employeesTasks, formValues } = this.state;
        const refinedTasks = formValues.employeeId
          ? employeesTasks.filter(
              (t) => t.employeeId === Number(formValues.employeeId)
            )
          : TeamsTasks;
        const filteredTasks = this.filterTasks(
          refinedTasks,
          this.state.formValues
        );
        //this.props.getTeamsCards(filteredTasks, this.props.Status);
        this.props.getScheduleCards(filteredTasks);
      }
    );
  };
  handleTeamsDateAndName = (value, name) => {
    this.setState(
      { formValues: { ...this.state.formValues, [name]: value } },
      () => {
        const { TeamsTasks } = this.props;
        const { employeesTasks, formValues } = this.state;
        const refinedTasks = formValues.employeeId
          ? employeesTasks.filter(
              (t) => t.employeeId === Number(formValues.employeeId)
            )
          : TeamsTasks;
        const filteredTasks = this.filterTasks(
          refinedTasks,
          this.state.formValues
        );
        //this.props.getTeamsCards(filteredTasks, this.props.Status);
        this.props.getScheduleCards(filteredTasks);
      }
    );
  };
  handleScheduleDateAndName = (value, name) => {
    this.setState(
      { formValues: { ...this.state.formValues, [name]: value } },
      () => {
        const filteredTasks = this.filterTasks(
          this.props.Tasks,
          this.state.formValues
        );
        //this.props.getScheduleCards(filteredTasks, this.props.Status);
        this.props.getScheduleCards(filteredTasks);
      }
    );
  };
  handleChangeSchedule = (value, e) => {
    this.setState(
      { formValues: { ...this.state.formValues, [e.name]: e.id } },
      () => {
        const filteredTasks = this.filterTasks(
          this.props.Tasks,
          this.state.formValues
        );
        //this.props.getScheduleCards(filteredTasks, this.props.Status);
        this.props.getScheduleCards(filteredTasks);
      }
    );
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  filterTasks = (tasks, queryParams) => {
    const todayDate = moment();
    const tomorowDate = moment().add(1, "d");

    const {
      nameLike,
      categoryId,
      priorityId,
      status,
      appId,
      deliveryTime,
      fromDueDate,
      toDueDate,
      employeeId,
    } = queryParams;
    let filteredTasks = tasks;
    if (nameLike)
      filteredTasks = filteredTasks.filter(
        (t) => t.name.includes(nameLike) || t.description.includes(nameLike)
      );

    if (employeeId)
      filteredTasks = filteredTasks.filter((t) => t.employeeId === employeeId);

    if (categoryId)
      filteredTasks = filteredTasks.filter((t) => t.categoryId === categoryId);

    if (priorityId)
      filteredTasks = filteredTasks.filter((t) => t.priorityId === priorityId);
    if (status)
      filteredTasks = filteredTasks.filter((t) => t.status === status);

    if (appId !== 0)
      filteredTasks = filteredTasks.filter((t) => t.appId === appId);

    if (fromDueDate) {
      filteredTasks = filteredTasks.filter((t) =>
        moment(t.dueDate, "iDD/iMM/iYYYY").isSameOrAfter(
          fromDueDate,
          "iDD/iMM/iYYYY"
        )
      );
    }

    if (toDueDate)
      filteredTasks = filteredTasks.filter((t) =>
        moment(t.dueDate, "iDD/iMM/iYYYY").isSameOrBefore(
          toDueDate,
          "iDD/iMM/iYYYY"
        )
      );
    switch (deliveryTime) {
      case 1:
        filteredTasks = filteredTasks.filter(
          (t) =>
            t.status !== 3 &&
            moment().isAfter(moment(t.dueDate, "iDD/iMM/iYYYY"), "day")
        );
        break;
      case 2:
        filteredTasks = filteredTasks.filter((t) =>
          // t.status !== 3 &&
          moment(t.dueDate, "iDD/iMM/iYYYY").isSame(todayDate, "day")
        );
        break;
      case 3:
        filteredTasks = filteredTasks.filter((t) =>
          // t.status !== 3 &&
          moment(t.dueDate, "iDD/iMM/iYYYY").isSame(tomorowDate, "day")
        );
        break;
      default:
        break;
    }
    return filteredTasks;
  };

  render() {
    const { Option } = Select;
    const { pageType } = this.props;
    return (
      <>
        {pageType === "archive" ? (
          <>
            <SearchHeader
              archive
              value={this.props.value}
              handleSearch={this.props.handleSearch}
            />

            <Row className="filterSearch">
              <Col lg={2} md={6} xs={6} className="DateContainer mb-2 mt-2">
                <DatePicker
                  placeholderText=" ----/--/--    إلي  &#xF073;"
                  onChangeRaw={this.handleDateChangeRaw}
                  selected={this.props.finishDate}
                  // value={this.state.formValues.toDueDate}
                  onChange={this.props.handleFinishDate}
                  calendar="hijri"
                />{" "}
                {/* <i className="fas fa-calendar dateToIcon"></i> */}
              </Col>{" "}
              <Col
                lg={2}
                md={6}
                xs={6}
                className="DateContainer datefromMobile mb-2 mt-2"
              >
                <DatePicker
                  onChangeRaw={this.handleDateChangeRaw}
                  placeholderText=" ----/--/--     من  &#xF073;"
                  selected={this.props.startDate}
                  // value={this.state.formValues.fromDueDate}
                  onChange={this.props.handleStartDate}
                  calendar="hijri"
                />{" "}
              </Col>{" "}
              <Col lg={2}></Col>
              <Col lg={3} md={4} xs={6} className="filterSearch mb-2 mt-2">
                <Select
                  virtual={false}
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  style={{ width: "100%" }}
                  placeholder="الأولوية"
                  onChange={this.props.handleSelectPriority}
                >
                  <Option name="selectedPriority" value="" id="">
                    كل الأولويات
                  </Option>
                  {this.props.Priorities.map((priority, index) => (
                    <Option
                      name="selectedPriority"
                      key={index}
                      value={priority.name}
                      id={priority.id}
                    >
                      {priority.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col lg={3} md={4} xs={6} className=" mb-2 mt-2">
                <Select
                  virtual={false}
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  style={{ width: "100%" }}
                  placeholder="المهام الرئيسية"
                  onChange={this.props.handleSelectCategory}
                  optionFilterProp="v"
                  filterOption={(input, option) => option.v.indexOf(input) >= 0}
                >
                  <Option name="selectedCategory" value="" id="" v="">
                    الكل{" "}
                  </Option>
                  {this.props.Categories.map((task, index) => (
                    <Option
                      name="selectedCategory"
                      v={task.name}
                      key={index}
                      id={task.id}
                    >
                      {task.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </>
        ) : pageType === "teamsSchedule" ? (
          <>
            <Media query="(max-width: 768px)">
              {(matches) =>
                matches ? (
                  <>
                    <Row>
                      <Col
                        sm={6}
                        xs={6}
                        className="DateContainer filtMobile"
                        style={{ marginTop: "5px " }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          placeholderText=" ----/--/--  إلي  &#xF073;"
                          selected={this.state.formValues.toDueDate}
                          // value={this.state.formValues.toDueDate}
                          onChange={(value) =>
                            this.handleTeamsDateAndName(value, "toDueDate")
                          }
                          calendar="hijri"
                        />
                      </Col>
                      <Col
                        sm={6}
                        xs={6}
                        className="DateContainer datefromMobile filtMobile "
                        style={{ marginTop: "5px" }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          selected={this.state.formValues.fromDueDate}
                          placeholderText="----/--/--   من  &#xF073;  "
                          onChange={(value) =>
                            this.handleTeamsDateAndName(value, "fromDueDate")
                          }
                          calendar="hijri"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        md={4}
                        xs={6}
                        className=" filterSearch mt-2 filtMobile"
                      >
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الموظفين"
                          onChange={this.handleChangeTeams}
                        >
                          <Option value="" id={0}>
                            الكل
                          </Option>
                          {this.state.allEmployees &&
                            this.state.allEmployees !== undefined &&
                            this.state.allEmployees.length !== 0 &&
                            this.state.allEmployees.map((employee, index) => (
                              <Option
                                name="employeeId"
                                value={employee.name}
                                key={index}
                                id={employee.id}
                              >
                                {employee.name}
                              </Option>
                            ))}
                        </Select>
                      </Col>
                      <Col
                        md={4}
                        xs={6}
                        className=" filterSearch mt-2 filtMobile"
                      >
                        {" "}
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="المهام الرئيسية"
                          onChange={this.handleChangeTeams}
                          optionFilterProp="v"
                          filterOption={(input, option) =>
                            option.v.indexOf(input) >= 0
                          }
                        >
                          <Option name="categoryId" id="" v="" value="">
                            الكل
                          </Option>
                          {this.props.Categories.map((task, index) => (
                            <Option
                              name="categoryId"
                              v={task.name}
                              key={index}
                              id={task.id}
                            >
                              {task.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col
                        md={6}
                        xs={6}
                        className=" filterSearch mt-2 filtMobile"
                      >
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="موعد التسليم"
                          onChange={this.handleChangeTeams}
                        >
                          <Option name="deliveryTime" value={""}>
                            {" "}
                            الكل
                          </Option>
                          {deliverTime.map((time, index) => (
                            <Option
                              name="deliveryTime"
                              value={time.name}
                              key={index}
                              id={time.id}
                            >
                              {time.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col sm={6} xs={6} className="searchForm searchFormSc  ">
                        <Input
                          type="text"
                          onChange={(e) =>
                            this.handleTeamsDateAndName(
                              e.target.value,
                              "nameLike"
                            )
                          }
                          placeholder="البحث باسم المهمة"
                        />
                        <Button className="searchIconBtn">
                          <FontAwesomeIcon icon={faSearch} />{" "}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="filterSearchMobile">
                      <Col md={4} xs={6} className="mb-2 filtMobile">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الحالة"
                          onChange={this.handleChangeTeams}
                        >
                          <Option name="status" value="">
                            الكل{" "}
                          </Option>
                          {this.props.Status.map((status, index) => (
                            <Option
                              name="status"
                              value={status.name}
                              key={index}
                              id={status.id}
                            >
                              {status.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col md={4} xs={6} className="mb-2 filtMobile">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الأولوية"
                          onChange={this.handleChangeTeams}
                        >
                          <Option name="priorityId" value="" id="">
                            {" "}
                            الكل
                          </Option>
                          {this.props.Priorities.map((priority, index) => (
                            <Option
                              name="priorityId"
                              value={priority.name}
                              key={index}
                              id={priority.id}
                            >
                              {priority.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>{" "}
                  </>
                ) : (
                  <>
                    <Row>
                      <Col
                        lg={3}
                        xs={6}
                        xl={2}
                        className="DateContainer"
                        style={{ marginTop: "31px " }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          placeholderText=" ----/--/--  إلي  &#xF073;"
                          selected={this.state.formValues.toDueDate}
                          // value={this.state.formValues.toDueDate}
                          onChange={(value) =>
                            this.handleTeamsDateAndName(value, "toDueDate")
                          }
                          calendar="hijri"
                        />
                      </Col>
                      <Col
                        xs={6}
                        lg={3}
                        xl={2}
                        className="DateContainer"
                        style={{ marginTop: "31px" }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          selected={this.state.formValues.fromDueDate}
                          placeholderText="----/--/--   من  &#xF073;  "
                          onChange={(value) =>
                            this.handleTeamsDateAndName(value, "fromDueDate")
                          }
                          calendar="hijri"
                        />{" "}
                      </Col>
                      <Col xl={2} className="d-xl-block d-md-none"></Col>
                      <Col xl={6} lg={6} xs={12} className="searchForm">
                        <Input
                          type="text"
                          onChange={(e) =>
                            this.handleTeamsDateAndName(
                              e.target.value,
                              "nameLike"
                            )
                          }
                          placeholder="البحث بواسطة اسم المهمة"
                        />
                        <Button className="searchIconBtn">
                          <FontAwesomeIcon icon={faSearch} />{" "}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="filterSearch">
                      <Col md={2} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="موعد التسليم"
                          onChange={this.handleChangeTeams}
                        >
                          <Option name="deliveryTime" value={""}>
                            كل مواعيد التسليم
                          </Option>
                          {deliverTime.map((time, index) => (
                            <Option
                              name="deliveryTime"
                              value={time.name}
                              key={index}
                              id={time.id}
                            >
                              {time.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col md={2} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الأولوية"
                          onChange={this.handleChangeTeams}
                        >
                          <Option name="priorityId" value="">
                            كل الأولويات
                          </Option>
                          {this.props.Priorities.map((priority, index) => (
                            <Option
                              name="priorityId"
                              value={priority.name}
                              key={index}
                              id={priority.id}
                            >
                              {priority.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col md={2} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="التطبيق"
                          onChange={(value, e) =>
                            this.handleChangeApp(value, e, "teams")
                          }
                        >
                          <Option name="appId" value={0}>
                            كل التطبيقات
                          </Option>
                          {this.state.apps?.map((app, index) => (
                            <Option
                              name="appId"
                              value={app.id}
                              key={`app-${index}`}
                              id={app.id}
                            >
                              {app.translate_ar_caption}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col md={2} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الحالة"
                          onChange={this.handleChangeTeams}
                        >
                          <Option name="status" value="">
                            كل الحالات
                          </Option>
                          {this.props.Status.map((status, index) => (
                            <Option
                              name="status"
                              value={status.name}
                              key={index}
                              id={status.id}
                            >
                              {status.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col md={3} xs={6} className="mb-2 filtMobile">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الموظفين"
                          onChange={this.handleChangeTeams}
                        >
                          <Option name="employeeId" value="" id={0}>
                            الكل
                          </Option>
                          {this.state.allEmployees &&
                            this.state.allEmployees !== undefined &&
                            this.state.allEmployees.length !== 0 &&
                            this.state.allEmployees.map((employee, index) => (
                              <Option
                                name="employeeId"
                                value={employee.name}
                                key={index}
                                id={employee.id}
                              >
                                {employee.name}
                              </Option>
                            ))}
                        </Select>
                      </Col>
                      <Col md={3} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="المهام الرئيسية"
                          onChange={this.handleChangeTeams}
                          optionFilterProp="v"
                          filterOption={(input, option) =>
                            option.v.indexOf(input) >= 0
                          }
                        >
                          <Option name="categoryId" value="" id="" v="">
                            الكل
                          </Option>
                          {this.props.Categories.map((task, index) => (
                            <Option
                              name="categoryId"
                              v={task.name}
                              key={index}
                              id={task.id}
                            >
                              {task.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>{" "}
                  </>
                )
              }
            </Media>
          </>
        ) : pageType === "managerSchedule" ? (
          <>
            {" "}
            <Media query="(max-width: 768px)">
              {(matches) =>
                matches ? (
                  <>
                    <Row>
                      <Col
                        sm={6}
                        xs={6}
                        className="DateContainer filtMobile"
                        style={{ marginTop: "5px " }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          placeholderText=" ----/--/--  إلي  &#xF073;"
                          selected={this.state.formValues.toDueDate}
                          // value={this.state.formValues.toDueDate}
                          onChange={(value) =>
                            this.handleScheduleDateAndName(value, "toDueDate")
                          }
                          calendar="hijri"
                        />
                      </Col>
                      <Col
                        sm={6}
                        xs={6}
                        className="DateContainer datefromMobile filtMobile "
                        style={{ marginTop: "5px" }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          selected={this.state.formValues.fromDueDate}
                          placeholderText="----/--/--   من  &#xF073;  "
                          onChange={(value) =>
                            this.handleScheduleDateAndName(value, "fromDueDate")
                          }
                          calendar="hijri"
                        />
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <Col
                        md={4}
                        xs={6}
                        className=" filterSearch mt-2 filtMobile"
                      >
                        {" "}
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="المهام الرئيسية"
                          onChange={this.handleChangeSchedule}
                          optionFilterProp="v"
                          filterOption={(input, option) =>
                            option.v.indexOf(input) >= 0
                          }
                        >
                          <Option name="categoryId" value="" v="">
                            الكل{" "}
                          </Option>
                          {this.props.Categories.map((task, index) => (
                            <Option
                              name="categoryId"
                              v={task.name}
                              key={index}
                              id={task.id}
                            >
                              {task.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col sm={6} xs={6} className="searchForm searchFormSc  ">
                        <Input
                          type="text"
                          onChange={(e) =>
                            this.handleScheduleDateAndName(
                              e.target.value,
                              "nameLike"
                            )
                          }
                          placeholder="البحث باسم المهمة"
                        />
                        <Button className="searchIconBtn">
                          <FontAwesomeIcon icon={faSearch} />{" "}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="filterSearchMobile">
                      <Col md={4} xs={4} className="mb-2 filtMobile">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="موعد التسليم"
                          onChange={this.handleChangeSchedule}
                        >
                          <Option name="deliveryTime" value={""}>
                            {" "}
                            الكل
                          </Option>
                          {deliverTime.map((time, index) => (
                            <Option
                              name="deliveryTime"
                              value={time.name}
                              key={index}
                              id={time.id}
                            >
                              {time.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col md={4} xs={4} className="mb-2 filtMobile">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الحالة"
                          onChange={this.handleChangeSchedule}
                        >
                          <Option name="status" value="">
                            الكل{" "}
                          </Option>
                          {this.props.Status.map((status, index) => (
                            <Option
                              name="status"
                              value={status.name}
                              key={index}
                              id={status.id}
                            >
                              {status.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col md={4} xs={4} className="mb-2 filtMobile">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الأولوية"
                          onChange={this.handleChangeSchedule}
                        >
                          <Option name="priorityId" value="">
                            {" "}
                            الكل
                          </Option>
                          {this.props.Priorities.map((priority, index) => (
                            <Option
                              name="priorityId"
                              value={priority.name}
                              key={index}
                              id={priority.id}
                            >
                              {priority.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>{" "}
                    <Col md={2} xs={6} className="mb-2">
                      <Select
                        virtual={false}
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        style={{ width: "100%" }}
                        placeholder="التطبيق"
                        onChange={this.handleChangeApp}
                      >
                        <Option name="appId" value={0}>
                          كل التطبيقات
                        </Option>
                        {this.state.apps?.map((app, index) => (
                          <Option
                            name="appId"
                            value={app.id}
                            key={index}
                            id={app.id}
                          >
                            {app.translate_ar_caption}
                          </Option>
                        ))}
                      </Select>
                    </Col>{" "}
                  </>
                ) : (
                  <>
                    <Row>
                      <Col
                        lg={3}
                        xs={6}
                        xl={2}
                        className="DateContainer"
                        style={{ marginTop: "31px " }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          placeholderText=" ----/--/--  إلي  &#xF073;"
                          selected={this.state.formValues.toDueDate}
                          // value={this.state.formValues.toDueDate}
                          onChange={(value) =>
                            this.handleScheduleDateAndName(value, "toDueDate")
                          }
                          calendar="hijri"
                        />
                      </Col>
                      <Col
                        xs={6}
                        lg={3}
                        xl={2}
                        className="DateContainer"
                        style={{ marginTop: "31px" }}
                      >
                        <DatePicker
                          onChangeRaw={this.handleDateChangeRaw}
                          selected={this.state.formValues.fromDueDate}
                          placeholderText="----/--/--   من  &#xF073;  "
                          onChange={(value) =>
                            this.handleScheduleDateAndName(value, "fromDueDate")
                          }
                          calendar="hijri"
                        />{" "}
                      </Col>
                      <Col xl={2} className="d-xl-block d-md-none"></Col>
                      <Col xl={6} lg={6} xs={12} className="searchForm">
                        <Input
                          type="text"
                          onChange={(e) =>
                            this.handleScheduleDateAndName(
                              e.target.value,
                              "nameLike"
                            )
                          }
                          placeholder="البحث بواسطة اسم المهمة"
                        />
                        <Button className="searchIconBtn">
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </Col>
                    </Row>
                    <Row className="filterSearch">
                      <Col md={3} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="موعد التسليم"
                          onChange={this.handleChangeSchedule}
                        >
                          <Option name="deliveryTime" value={""}>
                            كل مواعيد التسليم
                          </Option>
                          {deliverTime.map((time, index) => (
                            <Option
                              name="deliveryTime"
                              value={time.name}
                              key={index}
                              id={time.id}
                            >
                              {time.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col md={3} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الأولوية"
                          onChange={this.handleChangeSchedule}
                        >
                          <Option name="priorityId" value="">
                            كل الأولويات
                          </Option>
                          {this.props.Priorities.map((priority, index) => (
                            <Option
                              name="priorityId"
                              value={priority.name}
                              key={index}
                              id={priority.id}
                            >
                              {priority.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col md={2} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="التطبيق"
                          onChange={this.handleChangeApp}
                        >
                          <Option name="appId" value={0}>
                            كل التطبيقات
                          </Option>
                          {this.state.apps?.map((app, index) => (
                            <Option
                              name="appId"
                              value={app.id}
                              key={index}
                              id={app.id}
                            >
                              {app.translate_ar_caption}
                            </Option>
                          ))}
                        </Select>
                      </Col>{" "}
                      <Col md={3} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="الحالة"
                          onChange={this.handleChangeSchedule}
                        >
                          <Option name="status" value="">
                            كل الحالات
                          </Option>
                          {this.props.Status.map((status, index) => (
                            <Option
                              name="status"
                              value={status.name}
                              key={index}
                              id={status.id}
                            >
                              {status.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col md={3} xs={6} className="mb-2">
                        <Select
                          virtual={false}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          style={{ width: "100%" }}
                          placeholder="المهام الرئيسية"
                          onSelect={this.handleChangeSchedule}
                          optionFilterProp="v"
                          filterOption={(input, option) =>
                            option.v.indexOf(input) >= 0
                          }
                        >
                          <Option name="categoryId" v="" value="">
                            الكل{" "}
                          </Option>
                          {this.props.Categories.map((task, index) => (
                            <Option
                              name="categoryId"
                              key={task.id}
                              id={task.id}
                              v={task.name}
                            >
                              {task.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>
                  </>
                )
              }
            </Media>
          </>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  Status: state.Tasks.Status,
  Priorities: state.Tasks.Priorities,
  Categories: state.Categories.FlatCategories,
  Tasks: state.Tasks.Tasks,
  TeamsTasks: state.Tasks.TeamsTasks,
  Employees: state.Groups.Employess,
});

const mapDispatchToProps = {
  getScheduleCards,
  getTeamsCards,
  getEmpList,
  clearAllEmp,

  getTeamTasksList,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterSearchTasks);
