import React, { Component } from "react";
//Packages Importing
import { Card, Row, Col, Button, Badge } from "antd";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import TaskDetails from "../modals/TaskDetails";
import {
  getTaskDetails,
  clearTaskDetails,
} from "../../redux/actions/TasksActions";
import moment from "moment-hijri";
import TaskComments from "../modals/TaskComments";
import getRootCategoryName from "../../helpers/getRootCategoryName";
import { faCalendar, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copySupportCardInfo from "../../helpers/copySupportCardInfoToClipboard";

const todayDate = moment().format("iDD/iMM/iYYYY");
class MainCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      showComments: false,
      priorityBackground: "#fce1e1",
      priorityColor: "#800202",
      priorityName: "",
      showAddComment: false,
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
  openCommentsModal = (isSupport = false) => {
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

  render() {
    const { CategoriesParentMap, CategoriesNameMap, categoryId } = this.props;
    const rootCategoryName = getRootCategoryName(
      categoryId,
      CategoriesParentMap,
      CategoriesNameMap
    );

    return (
      <Container className="mt-1">
        <Card className="TaskCard">
          <Row>
            <Col xs={{ span: 12 }} className="maintaskname">
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
                  ? "????????"
                  : this.props.priorityId === 2
                  ? "????????"
                  : "??????"}
              </span>
            </Col>
          </Row>
          <h6 className="subtaskname">{this.props.name}</h6>
          {this.props.isSupportTicket ? (
            <p className="cardUserName">
              <span>????????????:</span>
              {this.props.createdBy_Name}
            </p>
          ) : null}
          {this.props.employees ? (
            this.props.employees.length === 1 ? (
              <h6 className="employeename">
                {this.props.employees[0].employeeName}
              </h6>
            ) : (
              <h6 className="employeename">
                {this.props.employees[0].employeeName} ????????????
              </h6>
            )
          ) : null}
          <Row>
            <Col xs={{ span: 24 }} md={{ span: 14 }}>
              <p className="dateTitle pt-2">
                <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                ???????????? ?????????????? ???????????? ????????????
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
                    ?????????? ????
                  </p>
                  <h6 style={{ textAlign: "left" }} className="Carddate">
                    {this.props.finishedOn}
                  </h6>
                </>
              </Col>
            ) : null}
            {this.props.isSupportTicket ? (
              <Col span={24}>
                <h6 className="employeename" style={{ fontSize: "15px" }}>
                  ???????? ?????????????? ??????????????{" "}
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
          <Row className="CardBtns pt-3">
            <Col span={12}className='mt-1' style={{ textAlign: "right" }}>
              <Button
                id={this.props.id}
                className="detailsBtn"
                onClick={this.openDetailsModal}
              >
                ????????????????
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: "left" }}>
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
                ?????????????? ??????????
              </Button>
            </Col>
            {this.props.isSupportTicket ? (
              <Button
                id={this.props.id}
                onClick={() => this.openCommentsModal(true)}
                className="commentsBtn mt-2"
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
?????????????? ?????????? ??????????              </Button>
            ) : null}
          </Row>
          <TaskDetails
            home={true}
            status={this.props.status}
            id={this.props.id}
            onHide={this.closeDetailsModal}
            show={this.state.showDetails}
            // managerCard="manager"
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
};

export default connect(mapStateToProps, mapDispatchToProps)(MainCard);
