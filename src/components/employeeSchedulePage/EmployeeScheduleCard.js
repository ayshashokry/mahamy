import React, { Component } from "react";
//Packages Importing
import { Card, Row, Col, Button, Badge } from "antd";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import TaskDetails from "../modals/TaskDetails";
import TaskComments from "../modals/TaskComments";
import {
  getTaskDetails,
  clearTaskDetails,
  editArchivedTask,
} from "../../redux/actions/TasksActions";
import { pinTask, unPinTask } from "../../redux/actions/StatusActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMapPin,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import getRootCategoryName from "../../helpers/getRootCategoryName";
import copySupportCardInfo from "../../helpers/copySupportCardInfoToClipboard";

class EmployeeScheduleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      showComments: false,
      priorityBackground: "#fce1e1",
      priorityColor: "#800202",
      priorityName: "",
      showAddComment: false,
      displayedCards: [],
      unseen: this.props.unseenCommentsCount,
      supportUnseen: this.props.unseenSupportCommentsCount,
      isSupportComments: false,
    };
  }
  openAddComment = () => {
    this.setState({ showAddComment: true });
    this.setState({ showComments: false });
  };
  closeAddComment = () => {
    this.setState({ showAddComment: false });
    this.setState({ showComments: true });
  };

  openDetailsModal = () => {
    this.setState({ showDetails: true });
    this.props.getTaskDetails(this.props.id);
  };
  closeDetailsModal = () => {
    this.setState({ showDetails: false });
    this.props.clearTaskDetails();
  };
  openCommentsModal = async (isSupport = false) => {
    if (isSupport) {
      this.setState({
        showComments: true,
        isSupportComments: true,
        supportUnseen: 0,
      });
    } else {
      this.setState({ showComments: true });
      this.setState({ unseen: 0 });
    }
  };
  closeCommentsModal = () => {
    this.setState({ showComments: false, isSupportComments: false });
  };
  pinCard = async (e) => {
    this.props.pinTask(this.props.id, true, this.props.status);
    this.props.editArchivedTask(
      { id: this.props.id, isPinned: true },
      false,
      "patch"
    );
  };
  unPinCard = async (e) => {
    this.props.unPinTask(this.props.id, false, this.props.status);
    this.props.editArchivedTask(
      { id: this.props.id, isPinned: false },
      false,
      "patch"
    );
  };

  render() {
    const { employees, CategoriesParentMap, CategoriesNameMap, categoryId } =
      this.props;
    const rootCategoryName = getRootCategoryName(
      categoryId,
      CategoriesParentMap,
      CategoriesNameMap
    );
    return (
      // <Draggable
      //   index={this.props.MyIndex}
      //   key={this.props.id}
      //   draggableId={String(this.props.id)}
      // >
      //   {(provided) => (
      //     <div
      //       ref={provided.innerRef}
      //       {...provided.draggableProps}
      //       {...provided.dragHandleProps}
      //     >
      <Container className="mt-4">
        <Card className="TaskCard">
          <Row>
            <Col
              md={{ span: 12 }}
              xs={{ span: 12 }}
              style={{ textAlign: "right" }}
            >
              {this.props.isPinned === true ? (
                <Button
                  className="pinBtn"
                  style={{ textAlign: "right" }}
                  onClick={this.unPinCard}
                >
                  <FontAwesomeIcon
                    icon={faMapPin}
                    style={{ color: "#e13333" }}
                  />
                </Button>
              ) : (
                <Button
                  className="pinBtn"
                  onClick={this.pinCard}
                  style={{ textAlign: "right" }}
                >
                  <FontAwesomeIcon icon={faMapPin} style={{ color: "gray" }} />
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 12 }} xs={{ span: 12 }} className="maintaskname">
              <h6>
                {rootCategoryName ? `${rootCategoryName} / ` : null}
                {CategoriesNameMap[categoryId]}
              </h6>
            </Col>
            <Col xs={{ span: 12 }} className="taskpriority">
              <span
                style={{
                  backgroundColor:
                    this.props.priorityId === 1
                      ? "#e1fce2"
                      : this.props.priorityId === 2
                      ? "#fce1e1"
                      : "#ecd6b1",
                  color:
                    this.props.priorityId === 1
                      ? "#016606"
                      : this.props.priorityId === 2
                      ? "#800202"
                      : "#99630a",
                }}
              >
                {this.props.priorityId === 1
                  ? "عادى"
                  : this.props.priorityId === 2
                  ? "عاجل"
                  : "سري"}
              </span>
            </Col>
          </Row>
          <h6 className="subtaskname">{this.props.name}</h6>{" "}
          {this.props.isSupportTicket ? (
            <p className="cardUserName">
              <span>انشأها:</span>
              {this.props.createdBy_Name}
            </p>
          ) : null}
          {this.props.isInQA || this.props.isQA || this.props.isQAPassed ? (
            <Col xs={{ span: 12 }} className="qaProceeBtn">
              <span
                style={{
                  backgroundColor:
                    this.props.isInQA ||
                    (!this.props.isQA &&
                      this.props.isQAPassed === false &&
                      this.props.status === 3)
                      ? "#ecd6b1"
                      : this.props.isQAPassed
                      ? "#e1fce2"
                      : this.props.isQAPassed === false
                      ? "#fce1e1"
                      : "",
                  color:
                    this.props.isInQA ||
                    (!this.props.isQA &&
                      this.props.isQAPassed === false &&
                      this.props.status === 3)
                      ? "#99630a"
                      : this.props.isQAPassed
                      ? "#016606"
                      : this.props.isQAPassed === false
                      ? "#800202"
                      : "",
                }}
              >
                {this.props.isInQA
                  ? "قيد الفحص"
                  : this.props.isQAPassed
                  ? "مقبول"
                  : this.props.isQAPassed === false
                  ? "مرفوض"
                  : null}
              </span>
            </Col>
          ) : null}
          {this.props.employees.length === 1 ? (
            <h6 className="employeename">
              {this.props.employees[0].employeeName}
            </h6>
          ) : (
            <h6 className="employeename">
              {this.props.employees[0].employeeName} وآخرين
            </h6>
          )}
          <Row>
            <Col xs={{ span: 24 }} md={{ span: 14 }}>
              <p className="dateTitle pt-2">
                <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                الفترة المحددة لإنهاء المهمة
              </p>
              <h6 className="Carddate">
                {this.props.assignedOn} - {this.props.dueDate}
              </h6>
            </Col>{" "}
            {this.props.finishedOn ? (
              <Col xs={{ span: 24 }} md={{ span: 10 }}>
                <>
                  <p style={{ textAlign: "left" }} className="dateTitle pt-3">
                    <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                    انتهت في
                  </p>
                  <h6 style={{ textAlign: "left" }} className="Carddate">
                    {this.props.finishedOn}
                  </h6>
                </>
              </Col>
            ) : null}
          </Row>
          <Row style={{ height: "20px", width: "100%", marginTop: "20px" }}>
            <Col
              sm={{ span: 8 }}
              style={{ backgroundColor: "#eedfe8", borderRadius: "5px" }}
            ></Col>
            <Col
              sm={{ span: 8 }}
              style={{ backgroundColor: "#dfe2ee", borderRadius: "5px" }}
            ></Col>
            <Col
              sm={{ span: 8 }}
              style={{ backgroundColor: "#dfeee1", borderRadius: "5px" }}
            ></Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col sm={{ span: 8 }} style={{ textAlign: "right" }}>
              <span className="cardStatusName" style={{ color: "#e1a4c8" }}>
                لم تبدأ
              </span>
              <span className="pr-4 cardStatusNumber">
                {employees && employees.filter((e) => e.status === 1).length}
              </span>
            </Col>
            <Col sm={{ span: 8 }} style={{ textAlign: "center" }}>
              <span className="cardStatusName" style={{ color: "#91a1e0" }}>
                قيد التنفيذ
              </span>
              <span className="pr-4 cardStatusNumber">
                {employees && employees.filter((e) => e.status === 2).length}
              </span>
            </Col>{" "}
            <Col sm={{ span: 8 }} style={{ textAlign: "left" }}>
              <span className="cardStatusName" style={{ color: "#9fdfa7" }}>
                مكتمل
              </span>
              <span className="pr-4 cardStatusNumber">
                {employees && employees.filter((e) => e.status === 3).length}
              </span>
            </Col>
            {this.props.isSupportTicket ? (
              <Col span={24}>
                <h6 className="employeename" style={{ fontSize: "15px" }}>
                  لنسخ معلومات التذكرة{" "}
                  <FontAwesomeIcon
                    icon={faCopy}
                    style={{ cursor: "pointer" }}
                    className="mx-2 copyIcon"
                    onClick={() => copySupportCardInfo(this.props)}
                  />
                </h6>
              </Col>
            ) : null}
          </Row>
          <Row className="CardBtns pt-4">
            <Col span={12}className='mt-1' style={{ textAlign: "right" }}>
              <Button
                id={this.props.id}
                className="detailsBtn"
                onClick={this.openDetailsModal}
              >
                التفاصيل
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: "center" }}>
              <Button
                id={this.props.id}
                onClick={() => this.openCommentsModal(false)}
                className="commentsBtn"
              >
                <Badge
                  count={this.state.unseen}
                  style={{
                    top: "-15px",
                    left: "5px",
                    backgroundColor: "#025358",
                    color: "#fff",
                  }}
                ></Badge>
                تعليقات مهامي 
              </Button>
            </Col>
            {this.props.isSupportTicket ? (
              <Button
                id={this.props.id}
                onClick={() => this.openCommentsModal(true)}
                className="commentsBtn"
              >
                <Badge
                  count={this.state.supportUnseen}
                  style={{
                    top: "-15px",
                    left: "5px",
                    backgroundColor: "#025358",
                    color: "#fff",
                  }}
                ></Badge>
             تعليقات الدعم الفني
              </Button>
            ) : null}
          </Row>
          <TaskDetails
            status={this.props.status}
            id={this.props.id}
            onHide={this.closeDetailsModal}
            show={this.state.showDetails}
            managerCard="team"
          />
          {this.state.showComments ? (
            <TaskComments
              name={this.props.name}
              taskId={this.props.id}
              onHide={this.closeCommentsModal}
              show={this.state.showComments}
              isSupportComments={this.state.isSupportComments}
              showAddComment={this.state.showAddComment}
              closeAddComment={this.closeAddComment}
              openAddComment={this.openAddComment}
            />
          ) : (
            <></>
          )}
        </Card>
      </Container>
      //     </div>
      //   )}
      // </Draggable>
    );
  }
}
const mapStateToProps = (state) => ({
  Priorities: state.Tasks.Priorities,
  CategoriesParentMap: state.Categories.CategoriesParentMap,
  CategoriesNameMap: state.Categories.CategoriesNameMap,
});
const mapDispatchToProps = {
  getTaskDetails,
  clearTaskDetails,
  pinTask,
  editArchivedTask,
  unPinTask,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeScheduleCard);
