import React, { Component } from "react";
import { Modal, Dropdown, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { Row, Col, Badge, Tooltip } from "antd";
import AddComment from "./AddComment";
import { deleteTaskComment } from "../../api/tasksApi";
import EditCommentForm from "../forms/EditCommentForm";
import { baseUrl, fileUrl } from "../../api/baseUrl";
import { InfoOutlined } from "@material-ui/icons";
import PreLoading from "../layout/PreLoading";
import { getTaskComments, getTaskCommentsStats } from "../../api/tasksApi";
import moment from "moment-hijri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import {
  deleteTicketComment,
  getTicketComments,
  getTicketCommentsStats,
} from "../../api/ticketsApi";

class TaskComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddComment: false,
      showDeleteModal: null,
      showConfirm: false,
      showEdit: null,
      taskComments: [],
      commentIndexToEdit: null,
      loading: true,
    };
  }

  changeTaskCommentsState = (payload, op) => {
    let { taskComments } = this.state;
    switch (op) {
      case "add":
        taskComments = [...taskComments, payload];
        break;
      case "edit":
        const index = taskComments.findIndex((c) => c.id === payload.id);
        taskComments.splice(index, 1, payload);
        break;
      case "delete":
        taskComments = taskComments.filter((c) => c.id !== payload);
        break;
      default:
        break;
    }
    this.setState({ taskComments });
  };

  addShowOptionsMenuPropertyToTaskComments = async (comments) => {
    const { userId } = this.props;
    const lastCommentIndex = comments.length - 1;
    if (lastCommentIndex < 0) return;

    const lastUserToComment = comments[lastCommentIndex].employeeId;
    for (let i = lastCommentIndex; i >= 0; i--) {
      const comment = comments[i];
      const isCurrentUserComment = Number(userId) === comment.employeeId;
      const isCommentByLastUserToComment =
        lastUserToComment === comment.employeeId;
      if (!isCommentByLastUserToComment) break;
      comment.showOptionsMenu = isCurrentUserComment;
    }
    this.setState({ comments, commentIndexToEdit: null });
  };

  addSeenByPropertyToTaskComments = async (comments, stats) => {
    comments.forEach((c) => {
      c.seenBy = [];
    });
    stats.forEach((s) => {
      if (s.lastSeenOn) {
        comments.forEach((c) => {
          const isCommentWrittenBeforeOrOnLastSeenDate = moment(
            (c.updatedOn || c.createdOn).replace("ص", "am").replace("م", "pm"),
            "iDD/iMM/iYYYY HH:mm a"
          ).isSameOrBefore(
            moment(
              s.lastSeenOn.replace("ص", "am").replace("م", "pm"),
              "iDD/iMM/iYYYY HH:mm a"
            )
          );
          const isCommentWriterNotCommentViewer = c.employeeId !== s.userId;
          if (
            isCommentWriterNotCommentViewer &&
            isCommentWrittenBeforeOrOnLastSeenDate
          ) {
            c.seenBy = [...c.seenBy, s.name];
          }
        });
      }
    });
  };

  setLoadingState = async (state = true) => {
    this.setState({ loading: state });
  };

  componentDidMount = async () => {
    const { taskId, isSupportComments } = this.props;
    await this.setLoadingState(true);
    const comments = isSupportComments
      ? await getTicketComments(taskId)
      : await getTaskComments(taskId);
    const stats = isSupportComments
      ? await getTicketCommentsStats(taskId)
      : await getTaskCommentsStats(taskId);
    await this.addSeenByPropertyToTaskComments(comments, stats);
    await this.addShowOptionsMenuPropertyToTaskComments(comments);
    this.setState({ taskComments: comments });
    await this.setLoadingState(false);
  };

  openAddComment = () => {
    this.setState({ showAddComment: true });
  };
  closeAddComment = () => {
    this.setState({ showAddComment: false });
  };

  openDeleteModal = (id) => {
    this.setState({ showDeleteModal: id });
  };
  closeDeleteModal = () => {
    this.setState({ showDeleteModal: null });
  };

  onDelete = async (e) => {
    this.props.isSupportComments
      ? await deleteTicketComment(this.props.taskId, e.target.id)
      : await deleteTaskComment(this.props.taskId, e.target.id);
    this.changeTaskCommentsState(Number(e.target.id), "delete");
    this.setState({ showDeleteModal: null });
    this.setState({ showConfirm: true });
    setTimeout(() => {
      this.setState({
        showConfirm: false,
      });
    }, 1600);
  };

  openEdit = (id, index) => {
    this.setState({ showEdit: id, commentIndexToEdit: index });
  };
  closeEdit = () => {
    this.setState({ showEdit: null });
  };
  render() {
    return (
      <>
        <Modal
          onHide={this.props.onHide}
          show={this.props.show}
          backdrop="static"
          className="TaskDetailsModal"
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              <Row>
                <Col span={12}>
                  <h5>
                    <FontAwesomeIcon icon={faPlusCircle} className="circle" />
                    التعليقات
                  </h5>
                </Col>
                <Col span={12}>
                  <h4>
                    <i
                      className="fas fa-times closeModal"
                      onClick={this.props.onHide}
                    ></i>
                  </h4>
                </Col>
              </Row>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body id="commentsModal">
            {this.state.loading ? (
              <PreLoading />
            ) : (
              <>
                <Row>
                  <Col span={24}>
                    <h6>اسم المهمة/ رقم المعاملة</h6>
                    <p>{this.props.name}</p>
                  </Col>
                </Row>
                {this.state.taskComments &&
                this.state.taskComments.length !== 0 ? (
                  this.state.taskComments.map((comment, index) =>
                    this.state.showEdit !== null ? (
                      this.state.showEdit === comment.id && (
                        <div className="commentCard" key={index}>
                          <EditCommentForm
                            taskId={comment.taskId}
                            comment={comment}
                            editTaskComment={(comment) =>
                              this.changeTaskCommentsState(comment, "edit")
                            }
                            isSupportComments={this.props.isSupportComments}
                            closeEdit={this.closeEdit}
                          />
                        </div>
                      )
                    ) : (
                      <div className="commentCard" key={index}>
                        {comment.showOptionsMenu ? (
                          <div className="dropdownsignoutlink float-left">
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="success"
                                id="dropdown-basic"
                              >
                                <i
                                  className="fas fa-ellipsis-v"
                                  style={{
                                    color: "#0b2548",
                                  }}
                                ></i>
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <div className="dropdownsignoutlink">
                                  <Dropdown.Item>
                                    <Button
                                      className="EditBTNN"
                                      onClick={() =>
                                        this.openEdit(comment.id, index)
                                      }
                                      id={comment.id}
                                    >
                                      تعديل
                                      <i
                                        style={{
                                          color: "#0b2548",
                                        }}
                                        className="fas fa-pencil-alt pl-3"
                                      ></i>{" "}
                                    </Button>
                                  </Dropdown.Item>

                                  <Dropdown.Item>
                                    <Button
                                      className="EditBTNN"
                                      id={comment.id}
                                      onClick={() =>
                                        this.openDeleteModal(comment.id)
                                      }
                                    >
                                      حذف
                                      <i
                                        style={{
                                          color: "#0b2548",
                                        }}
                                        className="fas fa-trash pl-3"
                                      ></i>
                                    </Button>
                                  </Dropdown.Item>
                                  <Modal
                                    style={{ textAlign: "right" }}
                                    show={
                                      this.state.showDeleteModal === comment.id
                                    }
                                    onHide={this.closeDeleteModal}
                                    backdrop="static"
                                    className="deleteTaskModal commDel"
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
                                        id={comment.id}
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
                        ) : null}

                        <h3>{comment.employeeName}</h3>
                        <span>{comment.createdOn}</span>
                        <h6>{comment.comment}</h6>
                        {comment.updatedOn
                          ? `${comment.updatedOn} عُدِلَ بتاريخ`
                          : null}
                        <Tooltip
                          placement="bottomLeft"
                          title={
                            comment.seenBy !== undefined &&
                            comment.seenBy.length > 0 ? (
                              <>
                                <div>شاهد التعليق</div>
                                <ul>
                                  {comment.seenBy.map((name, index) => (
                                    <li key={index}>{name}</li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <span>التعليق لم يُشاهد بعد</span>
                            )
                          }
                        >
                          <InfoOutlined color="primary" fontSize="small" />
                        </Tooltip>
                        {comment.attachments ? (
                          <Row className="mt-3" style={{ overflow: "hidden" }}>
                            <Col span={24}>
                              {comment.attachments.length === 0 ? null : (
                                <h5>المرفقات</h5>
                              )}
                              {comment.attachments.map((att, index) => (
                                <h5 key={index}>
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`${fileUrl}/${att.path}`}
                                  >
                                    {att.fileName}
                                  </a>
                                </h5>
                              ))}
                            </Col>
                          </Row>
                        ) : null}
                      </div>
                    )
                  )
                ) : (
                  <p
                    className="text-center"
                    style={{ fontWeight: "bold", fontSize: "20px" }}
                  >
                    لا توجد تعليقات
                  </p>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Col sm={24}>
              <Button className="commentsBtn" onClick={this.openAddComment}>
                إضافة تعليق
              </Button>
              {/* <Button className=" detailsBtn">التعليقات</Button> */}
            </Col>
          </Modal.Footer>
        </Modal>
        <AddComment
          taskId={this.props.taskId}
          name={this.props.name}
          addTaskComment={(comment) =>
            this.changeTaskCommentsState(comment, "add")
          }
          isSupportComments={this.props.isSupportComments}
          show={this.state.showAddComment}
          onHide={this.closeAddComment}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  userId:
    state.auth.user[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ],
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(TaskComments);
