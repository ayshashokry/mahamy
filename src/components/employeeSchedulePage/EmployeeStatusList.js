import React, { Component } from "react";
import EmployeeScheduleCard from "./EmployeeScheduleCard";
import { Row, Col } from "antd";
import { connect } from "react-redux";

export default class EmployeeStatusList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { cards, userId } = this.props;
    let sortedCards = cards.sort((a, b) => {
      if (!a.isPinned && !b.isPinned) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });

    sortedCards = sortedCards.filter((c) => {
      const employees = c.employees;
      return (
        employees &&
        (employees.length > 1 || employees[0].employeeId !== Number(userId))
      );
    });

    return (
      // <Droppable droppableId={String(this.props.listID)}>
      //   {(provided) => (
      <div
        // ref={provided.innerRef}
        className="square"
      >
        <div
          className="statusDiv"
          id={
            this.props.listID === 1
              ? "notStart"
              : this.props.listID === 2
              ? "working"
              : "finished"
          }
        >
          <Row>
            <Col xs={{ span: 12 }} className="text-right">
              <span className="statusTitle"> {this.props.title}</span>
            </Col>
            <Col xs={{ span: 12 }} className="text-left" style={{ left: "0" }}>
              <span className="cardsNum">{sortedCards.length}</span>
            </Col>
          </Row>
        </div>
        <div className="sqMenu">
          {sortedCards && sortedCards.length !== 0
            ? sortedCards.map((card, i) => (
                <Col xs={{ span: 24 }} key={i}>
                  <EmployeeScheduleCard MyIndex={i} {...card} />
                </Col>
              ))
            : null}
          {/* {provided.placeholder} */}
        </div>
      </div>
      //   )}
      // </Droppable>
    );
  }
}
