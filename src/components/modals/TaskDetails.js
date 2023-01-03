import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Row, Col, Button, notification, Tag } from "antd";
import {
  startTasks,
  reStartTasks,
  finishTasks,
  archiveTasks,
  reFinishTasks,
} from "../../redux/actions/StatusActions";
import {
  // startHomeTask,
  // finishHomeTask,
  // archiveHomeTask,
  editTask,
  editArchivedTask,
} from "../../redux/actions/TasksActions";
import {
  archiveTask,
  finishTask,
  reStartTask,
  startTask,
} from "../../api/tasksApi";
import { baseUrl, fileUrl } from "../../api/baseUrl";
import moment from "moment-hijri";
import ArchiveComments from "./ArchiveComments";
import PreLoading from "../layout/PreLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import copySupportCardInfo from "../../helpers/copySupportCardInfoToClipboard";

class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
    };
  }
  startTheTask = async () => {
    try {
      const task = await startTask(this.props.id);
      this.props.editTask({ id: this.props.id, status: 2 }, false, "patch");
      this.props.startTasks(this.props.id, task);
      this.props.onHide();
      this.confirmationStartTask();
    } catch (error) {
      this.props.onHide();
      this.showErrorNotification(error.message);
    }
  };
  startHomeTasks = async () => {
    this.props.startHomeTask(this.props.id);
    this.props.editTask(await startTask(this.props.id), false);
    this.props.onHide();
    this.confirmationStartTask();
  };
  reStartTheTask = async () => {
    try {
      const task = await reStartTask(this.props.id);
      this.props.editTask({ id: this.props.id, status: 1 }, false, "patch");
      this.props.reStartTasks(this.props.id, task);
      this.props.onHide();
      this.confirmationStartTask();
    } catch (error) {
      this.props.onHide();
      this.showErrorNotification(error.message);
    }
  };
  // reStartHomeTasks = async () => {
  //   this.props.startHomeTask(this.props.id);
  //   this.props.editTask(await reStartTask(this.props.id), false);
  //   this.props.onHide();
  //   this.confirmationStartTask();
  // };
  finishTheTask = async () => {
    try {
      const task = await finishTask(this.props.id);
      const todaysDate = moment().format("iDD/iMM/iYYYY");
      this.props.finishTasks(this.props.id, task);
      this.props.editTask(
        { id: this.props.id, status: 3, finishedOn: todaysDate },
        false,
        "patch"
      );
      this.props.onHide();
      this.confirmationFinishTask();
    } catch (error) {
      this.props.onHide();
      this.showErrorNotification(error.message);
    }
  };

  reFinishTask = async () => {
    try {
      const task = await startTask(this.props.id);
      this.props.editTask(
        { id: this.props.id, status: 2, finishedOn: null },
        false,
        "patch"
      );
      this.props.reFinishTasks(this.props.id, task);
      this.props.onHide();
      this.confirmationStartTask();
    } catch (error) {
      this.props.onHide();
      this.showErrorNotification(error.message);
    }
  };
  finishHomeTasks = async () => {
    this.props.finishHomeTask(this.props.id);
    this.props.editTask(await finishTask(this.props.id), false);
    this.props.onHide();
    this.confirmationFinishTask();
  };
  archiveTheTask = async () => {
    this.props.archiveTasks(this.props.id);
    this.props.editArchivedTask(
      { id: this.props.id, isArchived: true },
      false,
      "patch"
    );
    this.props.onHide();
    this.confirmationArchiveTask();
  };
  archiveHomeTasks = async () => {
    this.props.archiveHomeTask(this.props.id);
    this.props.editTask(await archiveTask(this.props.id), false);
    this.props.onHide();
    this.confirmationArchiveTask();
  };
  confirmationStartTask = () => {
    const args = {
      description: "تم بدأ المهمة بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  confirmationFinishTask = () => {
    const args = {
      description: "تم تنفيذ المهمة بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  confirmationArchiveTask = () => {
    const args = {
      description: "تم إنهاء المهمة بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  openCommentsModal = () => {
    this.setState({ showComments: true });
  };
  closeCommentsModal = () => {
    this.setState({ showComments: false });
  };

  showErrorNotification(msg) {
    notification.error({
      description: msg,
      duration: 5,
    });
  }

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
          centered>
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              <Row>
                <Col span={18}>
                  <h5>
                    <FontAwesomeIcon icon={faPlusCircle} className="circle" />
                    تفاصيل المهمة
                  </h5>
                </Col>
                <Col span={6}>
                  <h4>
                    <i
                      className="fas fa-times closeModal"
                      onClick={this.props.onHide}></i>
                  </h4>
                </Col>
              </Row>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {Object.keys(this.props.singledetails).length !== 0 ? (
              <>
                <Row className="mt-4">
                  <Col span={24}>
                    <h6>اسم المهمة/ رقم المعاملة</h6>
                    <p>{this.props.singledetails.name}</p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col span={11}>
                    <h6>أنشأها</h6>
                    <p>{this.props.singledetails.createdBy}</p>
                  </Col>{" "}
                  <Col span={2}></Col>
                  {this.props.singledetails.finishedOn ? (
                    <Col span={11}>
                      <h6>تاريخ الانتهاء</h6>
                      <p>{this.props.singledetails.finishedOn}</p>
                    </Col>
                  ) : null}
                </Row>

                <Row className="mt-4">
                  <Col span={11}>
                    <h6>اسم المستخدم</h6>
                    <p>
                      {this.props.singledetails.createdBy}{" "}
                      {this.props.singledetails.isSupportTicket
                        ? `(${this.props.singledetails.createdByUsername})`
                        : null}
                    </p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col span={11}>
                    <h6>تاريخ الإسناد</h6>
                    <p>{this.props.singledetails.employees[0].assignedOn}</p>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <h6>تاريخ التسليم المتوقع</h6>
                    <p>{this.props.singledetails.dueDate}</p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col span={11}>
                    <h6>درجة الأولوية</h6>
                    <p>
                      {this.props.singledetails.priorityId === 1
                        ? "عادي"
                        : this.props.singledetails.priorityId === 2
                        ? "عاجل"
                        : " سري"}
                    </p>
                  </Col>
                  <Col span={2}></Col>
                  {this.props.singledetails.outputs &&
                  this.props.singledetails.outputs !== undefined &&
                  this.props.singledetails.outputs.length !== 0 ? (
                    <Col span={11}>
                      <h6>المخرجات</h6>
                      <p>
                        {this.props.singledetails.outputs
                          .map(
                            (att) =>
                              this.props.OutPuts.filter(
                                (out) => out.id === att
                              )[0].name
                          )
                          .join("/")}
                      </p>
                    </Col>
                  ) : null}
                </Row>

                {this.props.singledetails.description ? (
                  <Row className="mt-4">
                    <Col span={24}>
                      <h6>تفاصيل المهمة</h6>
                      <p>{this.props.singledetails.description}</p>
                    </Col>
                  </Row>
                ) : null}

                {/* {this.props.singledetails.notes ? (
              <Row className="mt-3">
                <Col span={24}>
                  <h6>ملاحظات</h6>
                  <p>{this.props.singledetails.notes}</p>
                </Col>
              </Row>
            ) : null} */}

                {this.props.singledetails.employees ? (
                  <Row className="mt-4">
                    <Col span={12}>
                      {this.props.singledetails.employees.some(
                        (emp) => emp.isQA == false
                      ) ? (
                        <>
                          {" "}
                          <h6>الموظفين </h6>
                          {this.props.singledetails.employees.map(
                            (emp, index) => (
                              <p>
                                {!emp.isQA ? (
                                  <>
                                    {emp.employeeName}
                                    <span>
                                      <Tag
                                        color={
                                          emp.status === 1
                                            ? "#eedfe8"
                                            : emp.status === 2
                                            ? "#dfe2ee"
                                            : "#dfeee1"
                                        }>
                                        {emp.status === 1
                                          ? "لم يبدأ بعد"
                                          : emp.status === 2
                                          ? "قيد التنفيذ"
                                          : "أكمل المهمة"}
                                      </Tag>
                                    </span>
                                  </>
                                ) : null}
                              </p>
                            )
                          )}
                        </>
                      ) : null}
                    </Col>

                    <Col span={12}>
                      {this.props.singledetails.employees.some(
                        (emp) => emp.isQA == true
                      ) ? (
                        <>
                          {" "}
                          <h6>موظفين الجودة</h6>
                          {this.props.singledetails.employees.map(
                            (emp, index) => (
                              <p>
                                {emp.isQA ? (
                                  <>
                                    {emp.employeeName}
                                    <span>
                                      <Tag
                                        color={
                                          emp.status === 1
                                            ? "#eedfe8"
                                            : emp.status === 2
                                            ? "#dfe2ee"
                                            : "#dfeee1"
                                        }>
                                        {emp.status === 1
                                          ? "لم يبدأ بعد"
                                          : emp.status === 2
                                          ? "قيد التنفيذ"
                                          : "أكمل المهمة"}
                                      </Tag>
                                    </span>
                                  </>
                                ) : null}
                              </p>
                            )
                          )}
                        </>
                      ) : null}
                    </Col>

                    {this.props.singledetails.isSupportTicket ? (
                      <Col span={24}>
                        <h6
                          className="employeename"
                          style={{ fontSize: "15px" }}>
                          لنسخ معلومات التذكرة{" "}
                          <FontAwesomeIcon
                            icon={faCopy}
                            style={{ cursor: "pointer" }}
                            className="mx-2 copyIcon"
                            onClick={() =>
                              copySupportCardInfo(this.props.singledetails)
                            }
                          />
                        </h6>
                      </Col>
                    ) : null}
                  </Row>
                ) : null}
                <Row className="mt-4">
                  {this.props.singledetails.attachments ? (
                    <Col span={12}>
                      {this.props.singledetails.attachments.length ===
                      0 ? null : (
                        <h6>المرفقات</h6>
                      )}
                      {this.props.singledetails.attachments.map(
                        (att, index) => (
                          <h6>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`${fileUrl}/${att.path}`}>
                              {att.fileName}
                            </a>
                          </h6>
                        )
                      )}
                      {/* {this.props.singledetails.attachments.map(
                    (att) => {
        
                    }
                    // <p style={{ display: "block" ,padding:'10px'}}>{att}</p>
                    String(att).split(".").pop() == "pdf" ? (
                      <p>
                        <i
                          style={{ color: "#025358" }}
                          className="fas fa-file-pdf fa-3x text-right pl-2 "
                        ></i>
                      </p>
                    ) : String(att).split(".").pop() == "png" ||
                      String(att).split(".").pop() == "jpg" ||
                      String(att).split(".").pop() == "jpe" ||
                      String(att).split(".").pop() == "mpg" ? (
                      <p>
                        <img src={logo} className="pl-2" />
                      </p>
                    ) : String(att).split(".").pop() == "mpe" ? (
                      <p>
                        <i
                          style={{ color: "#025358" }}
                          className="fas fa-file-video fa-3x text-right pl-2"
                        ></i>
                      </p>
                    ) : String(att).split(".").pop() == "mp3" ? (
                      <p>
                        <i
                          style={{ color: "#025358" }}
                          className="fas fa-file-audio fa-3x text-right pl-2"
                        ></i>
                      </p>
                    ) : (
                      <p>
                        <i
                          style={{ color: "#025358" }}
                          className="far fa-file-word fa-3x text-right pl-2"
                        ></i>
                      </p>
                    )
                  )} */}
                    </Col>
                  ) : null}
                </Row>
              </>
            ) : (
              <PreLoading />
            )}
          </Modal.Body>

          <Modal.Footer>
            {this.props.archive ? (
              <Button
                id={this.props.id}
                onClick={this.openCommentsModal}
                className="commentsBtn">
                كل التعليقات
              </Button>
            ) : (
              <Col xs={24}>
                {this.props.status === 1 ? (
                  this.props.managerCard === "manager" ? (
                    <Button
                      onClick={
                        this.props.home
                          ? this.startHomeTasks
                          : this.startTheTask
                      }
                      className="commentsBtn">
                      بدأ تنفيذ المهمة
                    </Button>
                  ) : null
                ) : this.props.status === 2 ? (
                  this.props.managerCard === "manager" ? (
                    <Row>
                      <Col span={12} className="text-right">
                        <Button
                          onClick={
                            this.props.home
                              ? this.reStartHomeTask
                              : this.reStartTheTask
                          }
                          className="commentsBtn">
                          إعادة بدأ المهمة
                        </Button>
                      </Col>
                      <Col span={12} className="text-left">
                        <Button
                          onClick={
                            this.props.home
                              ? this.finishHomeTasks
                              : this.finishTheTask
                          }
                          className="commentsBtn">
                          تم تنفيذ المهمة
                        </Button>
                      </Col>
                    </Row>
                  ) : null
                ) : this.props.User !== "employee" ? (
                  <Row>
                    <Col span={12} className="text-right">
                      {this.props.managerCard === "manager" ? (
                        <Button
                          onClick={
                            this.props.home
                              ? this.startHomeTasks
                              : this.reFinishTask
                          }
                          className="commentsBtn">
                          إعادة تنفيذ المهمة
                        </Button>
                      ) : null}
                    </Col>
                    <Col span={12} className="text-left">
                      {this.props.managerCard === "team" ||
                      this.props.isManagerSpecific === true ? (
                        <Button
                          onClick={
                            this.props.home
                              ? this.archiveHomeTasks
                              : this.archiveTheTask
                          }
                          className="commentsBtn">
                          إنهاء المهمة
                        </Button>
                      ) : null}
                    </Col>
                  </Row>
                ) : null}
                {/* <Button className=" detailsBtn">التعليقات</Button> */}
              </Col>
            )}
          </Modal.Footer>
        </Modal>
        {this.state.showComments ? (
          <ArchiveComments
            name={this.props.name}
            taskId={this.props.id}
            onHide={this.closeCommentsModal}
            show={this.state.showComments}
          />
        ) : null}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  singledetails: state.Tasks.TaskDetails,
  OutPuts: state.Tasks.OutPuts,
  User: state.User,
});
const mapDispatchToProps = {
  startTasks,
  finishTasks,
  reStartTasks,
  archiveTasks,
  editTask,
  editArchivedTask,
  reFinishTasks,
};
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
