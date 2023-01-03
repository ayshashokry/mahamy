import React, { Component } from "react";
//Packages Importing
import {
  Container,
  Table,
  Dropdown,
  Modal,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { deleteTask } from "../../api/tasksApi";
import { notification, Input } from "antd";
import { Link } from "react-router-dom";
import PreLoading from "../layout/PreLoading";

//Images Importing
import NoTasksImg from "../../assets/images/Operating system-rafiki.png";

//Components Importing
import EditTaskForm from "../forms/EditTaskForm";
import AddTaskModal from "../modals/AddTaskModal";
import AddSubTaskForm from "../forms/AddSubTaskForm";

//Redux Importing
import {
  getTasksList,
  getTeamTasksList,
  deleteTheTask,
} from "../../redux/actions/TasksActions";
import { connect } from "react-redux";
import ReAssignForm from "../forms/ReAssignForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faSearch,
  faStepBackward,
} from "@fortawesome/free-solid-svg-icons";
class TaskManagmentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteModal: null,
      editTaskModalShow: null,
      showConfirm: false,
      showEditConfirm: false,
      reAssignModalShow: null,
      showReassignConfirm: false,
      displayedTasks: this.props.Tasks,
      searchString: "",
      addTaskModalShow: false,
      renderModal: "main",
      loading: false,
    };
  }
  openDeleteModal = (id) => {
    this.setState({ showDeleteModal: id });
  };
  openReassignModal = (id) => {
    this.setState({ reAssignModalShow: id });
  };

  onDelete = async (e) => {
    try {
      await deleteTask(e.target.id);
      this.props.deleteTheTask(e.target.id);
      this.props.getTeamTasksList();
      this.setState({ showDeleteModal: null });
      this.confirmationDeleteTask();
    } catch (e) {
      console.log("Can't delete task");
    }
  };
  // onDelete = async (e) => {
  //   try {
  //     await deleteTask(e.target.id);
  //     this.props.deleteTheTask(e.target.id);
  //     this.setState({ showDeleteModal: null });
  //     this.setState({ showConfirm: true });
  //     setTimeout(() => {
  //       this.setState({
  //         showConfirm: false,
  //       });
  //     }, 1600);
  //     this.props.getTeamTasksList();
  //     this.confirmationDeleteTask();
  //   } catch (error) {

  //   }
  // };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: null });
  };
  closeReassignModal = () => {
    this.setState({ reAssignModalShow: null });
  };
  openEditModal = (id) => {
    this.setState({ editTaskModalShow: id });
  };

  editConfirm = (e) => {
    this.setState({ showEditConfirm: true });
    setTimeout(() => {
      this.setState({
        showEditConfirm: true,
      });
    }, 1600);
  };

  reAssignConfirm = (e) => {
    this.setState({ showReassignConfirm: true });
    setTimeout(() => {
      this.setState({
        showReassignConfirm: true,
      });
    }, 1600);
  };
  closeEditTaskModal = () => {
    this.setState({ editTaskModalShow: null });
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getTeamTasksList();
    this.setState({ loading: true });

    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }

  confirmationAddTask = () => {
    const args = {
      description: "تم إضافة مهمة فرعية بنجاح",
      duration: 3,
    };
    notification.open(args);
  };

  confirmationDeleteTask = () => {
    const args = {
      description: "تم حذف المهمة بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  confirmationEditTask = () => {
    const args = {
      description: "تم تعديل المهمة بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  confirmationReassignTask = () => {
    const args = {
      description: "تم إعادة التوجيه بنجاح",
      duration: 3,
    };
    notification.open(args);
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

  render() {
    return (
      <div>
        <Container fluid className="manageDetailsMobile">
          {this.props.admin == "admin" ? (
            <Link className="backToManagment" to="/">
              <FontAwesomeIcon icon={faStepBackward} className="mr-2" />
              الرجوع لإدارة المهام
            </Link>
          ) : (
            <Link className="backToManagment" to="/Task-Management">
              <FontAwesomeIcon icon={faStepBackward} className="mr-2" />
              الرجوع لإدارة المهام
            </Link>
          )}
          <Col sm={12} className="">
            <Row className="searchForm">
              <Input
                type="text"
                onChange={this.handleSearch}
                placeholder="البحث بواسطة اسم المهمة"
              />
              <Button className="searchIconBtn pt-2">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Row>
          </Col>
          <Col sm={12}>
            <Button
              id="sub"
              onClick={this.openAddTaskModal}
              className="addbtn"
              style={{ fontWeight: "100" }}
            >
              إضافة مهمة فرعية
            </Button>
          </Col>
          {this.props.Categories.map((c, index) =>
            c.id == this.props.match.params.id ? (
              <h2 className="tableTitle text-right mt-2" key={index}>
                {c.name}
              </h2>
            ) : null
          )}
          {this.state.loading ? (
            <PreLoading />
          ) : this.props.selectedCategoryId !== "" &&
            this.props.Tasks.find(
              (c) => c.categoryId == this.props.match.params.id
            ) ? (
            <Table className="selectedTasksTable treeTable">
              <thead>
                <tr>
                  <th>العمليات</th>
                  <th>اسم المهمة</th>
                </tr>
              </thead>
              <tbody>
                {this.state.searchString === ""
                  ? this.props.Tasks.map((task, index) =>
                      task.categoryId == this.props.match.params.id ? (
                        <tr
                          key={index}
                          style={{
                            borderBottom: "1px solid #d4d6de",
                          }}
                        >
                          <td>
                            <div className="dropdownsignoutlink">
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                >
                                  <MoreHorizIcon
                                    style={{
                                      color: "#0b2548",
                                    }}
                                  />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <div className="dropdownsignoutlink">
                                    {!task.isSupportTicket ? (
                                      <Dropdown.Item>
                                        <Button
                                          className="EditBTNN"
                                          onClick={() =>
                                            this.openEditModal(task.id)
                                          }
                                          id={task.id}
                                        >
                                          <i
                                            style={{
                                              color: "#0b2548",
                                            }}
                                            className="fas fa-pencil-alt pl-3"
                                          ></i>{" "}
                                          تعديل
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}

                                    <Modal
                                      keyboard={false}
                                      backdrop="static"
                                      className="addTaskModal"
                                      show={
                                        this.state.editTaskModalShow === task.id
                                      }
                                      onHide={this.closeEditTaskModal}
                                      size="lg"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Header>
                                        {" "}
                                        <Modal.Title id="contained-modal-title-vcenter">
                                          <h5>
                                            {" "}
                                            تعديل بيانات المهمة
                                            <FontAwesomeIcon
                                              icon={faPlusCircle}
                                              className="circle"
                                            />
                                          </h5>
                                        </Modal.Title>
                                      </Modal.Header>

                                      <Modal.Body>
                                        <EditTaskForm
                                          confirmationEditTask={
                                            this.confirmationEditTask
                                          }
                                          isPinned={task.isPinned}
                                          editConfirm={this.editConfirm}
                                          onHide={this.closeEditTaskModal}
                                          taskId={task.id}
                                          {...task}
                                        />
                                      </Modal.Body>
                                    </Modal>
                                    <Dropdown.Item>
                                      <Button
                                        className="EditBTNN"
                                        id={task.id}
                                        onClick={() =>
                                          this.openReassignModal(task.id)
                                        }
                                        disabled={
                                          task.isSupportTicket &&
                                          task.status === 3
                                        }
                                      >
                                        {" "}
                                        <i
                                          style={{
                                            color: "#0b2548",
                                          }}
                                          className="fas fa-users-cog pl-3"
                                        ></i>{" "}
                                        إعادة توجيه
                                      </Button>
                                    </Dropdown.Item>
                                    <Modal
                                      keyboard={false}
                                      backdrop="static"
                                      className="addTaskModal"
                                      show={
                                        this.state.reAssignModalShow === task.id
                                      }
                                      onHide={this.closeReassignModal}
                                      size="lg"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Header>
                                        {" "}
                                        <Modal.Title id="contained-modal-title-vcenter">
                                          <h5>
                                            {" "}
                                            إعادة توجيه المهمة
                                            <FontAwesomeIcon
                                              icon={faPlusCircle}
                                              className="circle"
                                            />{" "}
                                          </h5>
                                        </Modal.Title>
                                      </Modal.Header>

                                      <Modal.Body>
                                        <ReAssignForm
                                          confirmationReassignTask={
                                            this.confirmationReassignTask
                                          }
                                          reAssignConfirm={this.reAssignConfirm}
                                          onHide={this.closeReassignModal}
                                          taskId={task.id}
                                          task={task}
                                          {...task}
                                        />
                                      </Modal.Body>
                                    </Modal>
                                    {!task.isSupportTicket ? (
                                      <Dropdown.Item>
                                        <Button
                                          className="EditBTNN"
                                          id={task.id}
                                          onClick={() =>
                                            this.openDeleteModal(task.id)
                                          }
                                        >
                                          {" "}
                                          <i
                                            style={{
                                              color: "#0b2548",
                                            }}
                                            className="fas fa-trash pl-3"
                                          ></i>{" "}
                                          حذف
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}
                                    <Modal
                                      keyboard={false}
                                      backdrop="static"
                                      style={{ textAlign: "right" }}
                                      show={
                                        this.state.showDeleteModal === task.id
                                      }
                                      onHide={this.closeDeleteModal}
                                      className="deleteTaskModal"
                                      {...this.state}
                                      size="lg"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Body>
                                        <h4 className="deleteCon">
                                          هل أنت متأكد من حذف هذه المهمة؟
                                        </h4>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button
                                          className="addbtn"
                                          onClick={this.closeDeleteModal}
                                        >
                                          إلغاء
                                        </Button>
                                        <Button
                                          className="addbtn"
                                          id={task.id}
                                          onClick={this.onDelete}
                                        >
                                          حذف
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </td>{" "}
                          <td>{task.name}</td>
                        </tr>
                      ) : null
                    )
                  : this.state.displayedTasks.map((task, index) =>
                      task.categoryId === this.props.match.params.id ? (
                        <tr
                          key={index}
                          style={{
                            borderBottom: "1px solid #d4d6de",
                          }}
                        >
                          <td>
                            <div className="dropdownsignoutlink">
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                >
                                  <i
                                    style={{
                                      color: "#0b2548",
                                    }}
                                    className="fas fa-ellipsis-h"
                                  ></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <div className="dropdownsignoutlink">
                                    {!task.isSupportTicket ? (
                                      <Dropdown.Item>
                                        <Button
                                          className="EditBTNN"
                                          onClick={() =>
                                            this.openEditModal(task.id)
                                          }
                                          id={task.id}
                                        >
                                          <i
                                            style={{
                                              color: "#0b2548",
                                            }}
                                            className="fas fa-pencil-alt pl-3"
                                          ></i>{" "}
                                          تعديل
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}
                                    <Modal
                                      keyboard={false}
                                      backdrop="static"
                                      className="addTaskModal"
                                      show={
                                        this.state.editTaskModalShow === task.id
                                      }
                                      onHide={this.closeEditTaskModal}
                                      size="lg"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Header>
                                        {" "}
                                        <Modal.Title id="contained-modal-title-vcenter">
                                          <h5>
                                            {" "}
                                            تعديل بيانات المهمة
                                            <FontAwesomeIcon
                                              icon={faPlusCircle}
                                              className="circle"
                                            />{" "}
                                          </h5>
                                        </Modal.Title>
                                      </Modal.Header>

                                      <Modal.Body>
                                        <EditTaskForm
                                          confirmationEditTask={
                                            this.confirmationEditTask
                                          }
                                          isPinned={task.isPinned}
                                          editConfirm={this.editConfirm}
                                          onHide={this.closeEditTaskModal}
                                          taskId={task.id}
                                          {...task}
                                        />
                                      </Modal.Body>
                                    </Modal>
                                    <Dropdown.Item>
                                      <Button
                                        className="EditBTNN"
                                        id={task.id}
                                        onClick={() =>
                                          this.openReassignModal(task.id)
                                        }
                                        disabled={
                                          task.isSupportTicket &&
                                          task.status === 3
                                        }
                                      >
                                        {" "}
                                        <i
                                          style={{
                                            color: "#0b2548",
                                          }}
                                          className="fas fa-users-cog pl-3"
                                        ></i>{" "}
                                        إعادة توجيه
                                      </Button>
                                    </Dropdown.Item>
                                    <Modal
                                      keyboard={false}
                                      backdrop="static"
                                      className="addTaskModal"
                                      show={
                                        this.state.reAssignModalShow === task.id
                                      }
                                      onHide={this.closeReassignModal}
                                      size="lg"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Header>
                                        {" "}
                                        <Modal.Title id="contained-modal-title-vcenter">
                                          <h5>
                                            {" "}
                                            إعادة توجيه المهمة
                                            <FontAwesomeIcon
                                              icon={faPlusCircle}
                                              className="circle"
                                            />{" "}
                                          </h5>
                                        </Modal.Title>
                                      </Modal.Header>

                                      <Modal.Body>
                                        <ReAssignForm
                                          confirmationReassignTask={
                                            this.confirmationReassignTask
                                          }
                                          reAssignConfirm={this.reAssignConfirm}
                                          onHide={this.closeReassignModal}
                                          taskId={task.id}
                                          task={task}
                                          {...task}
                                        />
                                      </Modal.Body>
                                    </Modal>
                                    {!task.isSupportTicket ? (
                                      <Dropdown.Item>
                                        <Button
                                          className="EditBTNN"
                                          id={task.id}
                                          onClick={() =>
                                            this.openDeleteModal(task.id)
                                          }
                                        >
                                          {" "}
                                          <i
                                            style={{
                                              color: "#0b2548",
                                            }}
                                            className="fas fa-trash pl-3"
                                          ></i>{" "}
                                          حذف
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}
                                    <Modal
                                      keyboard={false}
                                      backdrop="static"
                                      style={{ textAlign: "right" }}
                                      show={
                                        this.state.showDeleteModal === task.id
                                      }
                                      onHide={this.closeDeleteModal}
                                      className="deleteTaskModal"
                                      {...this.state}
                                      size="lg"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Body>
                                        <h4 className="deleteCon">
                                          هل أنت متأكد من حذف هذه المهمة؟
                                        </h4>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button onClick={this.closeDeleteModal}>
                                          إلغاء
                                        </Button>
                                        <Button
                                          id={task.id}
                                          onClick={this.onDelete}
                                        >
                                          حذف
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </td>{" "}
                          <td>{task.name}</td>
                        </tr>
                      ) : null
                    )}
              </tbody>
            </Table>
          ) : (
            <div className="noTasksdiv">
              <img
                src={NoTasksImg}
                alt="No Tasks Found"
                className="NotaskImg"
              />
              <h5 className="pt-2">لا توجد مهام فرعية</h5>
            </div>
          )}
        </Container>
        <AddTaskModal
          show={this.state.addTaskModalShow}
          onHide={this.closeAddTaskModal}
          title={
            this.state.renderModal === "main"
              ? "إضافة مهمة رئيسية جديدة"
              : "إضافة مهمة فرعية جديدة"
          }
        >
          {this.state.renderModal === "sub" ? (
            <AddSubTaskForm
              confirmationAddTask={this.confirmationAddTask}
              selectedCategoryId={Number(this.props.match.params.id)}
              onHide={this.closeAddTaskModal}
            />
          ) : null}
        </AddTaskModal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  Categories: state.Categories.FlatCategories,
  Tasks: state.Tasks.TeamsTasks,
  admin: state.auth.admin,
});
const mapDispatchToProps = {
  getTasksList,
  getTeamTasksList,
  deleteTheTask,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskManagmentDetails);
