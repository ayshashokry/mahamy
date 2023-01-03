import React, { Component } from "react";
import { Modal, Dropdown, Button } from "react-bootstrap";
import { Row, Col, Tooltip } from "antd";
import { baseUrl, fileUrl } from "../../api/baseUrl";
import PreLoading from "../layout/PreLoading";
import { getTaskComments, getTaskCommentsStats } from "../../api/tasksApi";
import moment from "moment-hijri";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ArchiveComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskComments: [],
      loading: true,
    };
  }

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

    this.setState({ taskComments: comments });
  };

  setLoadingState = async (state = true) => {
    this.setState({ loading: state });
  };

  componentDidMount = async () => {
    const { taskId } = this.props;
    await this.setLoadingState(true);
    const comments = await getTaskComments(taskId);
    const stats = await getTaskCommentsStats(taskId);
    await this.addSeenByPropertyToTaskComments(comments, stats);
    this.setState({ taskComments: comments });
    await this.setLoadingState(false);
  };

  render() {
    return (
      <div>
        <Modal
          onHide={this.props.onHide}
          show={this.props.show}
          backdrop="static"
          className="TaskDetailsModal archiveComments"
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
                  this.state.taskComments.map((comment, index) => (
                    <div className="commentCard" key={index}>
                      <h3>{comment.employeeName}</h3>
                      <span>{comment.createdOn}</span>
                      <h6>{comment.comment}</h6>

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
                  ))
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
        </Modal>
      </div>
    );
  }
}

export default ArchiveComments;
