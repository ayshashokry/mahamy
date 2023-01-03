import React, { Component } from "react";
//Packages Importing
import { Container, Table, Dropdown, Modal, Button } from "react-bootstrap";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { notification } from "antd";
//Images Importing
import NoTasksImg from "../../assets/images/Operating system-rafiki.png";
import PreLoading from "../layout/PreLoading";
//Components Importing
import EditTaskForm from "../forms/EditTaskForm";

//Redux Importing
import {
  getTeamTasksList,
  deleteTheTask,
  getTaskDetails,
} from "../../redux/actions/TasksActions";
import { connect } from "react-redux";
import ReAssignForm from "../forms/ReAssignForm";
import { deleteTask } from "../../api/tasksApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faPencilAlt,
  faPlusCircle,
  faTrash,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
class TreeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteModal: null,
      editTaskModalShow: null,
      showConfirm: false,
      showEditConfirm: false,
      reAssignModalShow: null,
      showReassignConfirm: false,
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

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: null });
  };
  closeReassignModal = () => {
    this.setState({ reAssignModalShow: null });
  };
  openEditModal = (id) => {
    this.setState({ editTaskModalShow: id });
    this.props.getTaskDetails(id);
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
    this.props.getTeamTasksList();
    console.log(this.props.searchString);
  }

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
  render() {
    console.log(this.props.TaskDetails);
    return (
      <div>
        <Container>
          {this.props.Categories && this.props.Categories.length !== 0
            ? this.props.Categories.map((c, index) =>
                c.id === this.props.selectedCategoryId ? (
                  <h2 className="tableTitle" key={index}>
                    {c.name}
                  </h2>
                ) : null
              )
            : null}
          {this.props.loading ? (
            <PreLoading />
          ) : this.props.selectedCategoryId !== "" &&
            this.props.Tasks.find(
              (c) => c.categoryId === this.props.selectedCategoryId
            ) ? (
            <Table className="selectedTasksTable treeTable">
              <thead>
                <tr>
                  <th>اسم المهمة/ رقم المعاملة</th>
                  <th>نوع المهمة</th>
                  <th>العمليات</th>
                </tr>
              </thead>
              <tbody>
                {this.props.searchString === ""
                  ? this.props.Tasks.map((task, index) =>
                      task.categoryId === this.props.selectedCategoryId ? (
                        <tr
                          key={index}
                          style={{
                            borderBottom: "1px solid #d4d6de",
                          }}
                        >
                          <td>{task.name}</td>
                          <td>فرعية</td>
                          <td>
                            <div className="dropdownsignoutlink">
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                >
                                  <FontAwesomeIcon
                                    style={{
                                      color: "#0b2548",
                                    }}
                                    icon={faEllipsisH}
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
                                          <FontAwesomeIcon
                                            style={{
                                              color: "#0b2548",
                                            }}
                                            icon={faPencilAlt}
                                            className="ml-3"
                                          />
                                          تعديل
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}
                                    <Modal
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
                                        <FontAwesomeIcon
                                          icon={faUsersCog}
                                          style={{
                                            color: "#0b2548",
                                          }}
                                          className="ml-3"
                                        />
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
                                            />
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
                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            className="ml-3"
                                          />
                                          حذف
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}
                                    <Modal
                                      style={{ textAlign: "right" }}
                                      show={
                                        this.state.showDeleteModal === task.id
                                      }
                                      onHide={this.closeDeleteModal}
                                      backdrop="static"
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
                          </td>
                        </tr>
                      ) : null
                    )
                  : this.props.displayedTasks.map((task, index) =>
                      task.categoryId === this.props.selectedCategoryId ? (
                        <tr
                          key={index}
                          style={{
                            borderBottom: "1px solid #d4d6de",
                          }}
                        >
                          <td>{task.name}</td>
                          <td>فرعية</td>
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
                                          id={task.id}
                                          onClick={() =>
                                            this.openEditModal(task.id)
                                          }
                                        >
                                          <FontAwesomeIcon
                                            style={{
                                              color: "#0b2548",
                                            }}
                                            icon={faPencilAlt}
                                            className="ml-3"
                                          />
                                          تعديل
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}
                                    <Modal
                                      backdrop="static"
                                      keyboard={false}
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
                                              className="circle"
                                              icon={faPlusCircle}
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
                                        <i
                                          style={{
                                            color: "#0b2548",
                                          }}
                                          className="fas fa-users-cog pl-3"
                                        ></i>
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
                                              className="circle"
                                              icon={faPlusCircle}
                                            />
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
                                          onClick={() =>
                                            this.openDeleteModal(task.id)
                                          }
                                          id={task.id}
                                        >
                                          <FontAwesomeIcon
                                            style={{
                                              color: "#0b2548",
                                            }}
                                            icon={faTrash}
                                            className="ml-3"
                                          />
                                          حذف
                                        </Button>
                                      </Dropdown.Item>
                                    ) : (
                                      <></>
                                    )}
                                    <Modal
                                      keyboard={false}
                                      style={{ textAlign: "right" }}
                                      show={
                                        this.state.showDeleteModal === task.id
                                      }
                                      backdrop="static"
                                      className="deleteTaskModal"
                                      onHide={this.closeDeleteModal}
                                      size="lg"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                    >
                                      <Modal.Body>
                                        <h4 className="deleteCon">
                                          {" "}
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
                          </td>
                        </tr>
                      ) : null
                    )}
              </tbody>
            </Table>
          ) : (
            <div className="noTasksdiv noTaskdesktop">
              <img
                src={NoTasksImg}
                alt="No Tasks Found"
                className="NotaskImg"
              />
              <h5 className="pt-2">لا توجد مهام فرعية</h5>
            </div>
          )}
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  Categories: state.Categories.FlatCategories,
  Tasks: state.Tasks.TeamsTasks,
  taskDet: state.Tasks.TaskDetails,
});
const mapDispatchToProps = {
  getTeamTasksList,
  deleteTheTask,
  getTaskDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeDetails);
