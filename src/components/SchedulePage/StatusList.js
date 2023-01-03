import React, { Component } from "react";
import ScheduleCard from "./ScheduleCard";
import { Row, Col } from "antd";
import { Droppable } from "react-beautiful-dnd";
import moment from "moment-hijri";

export default class StatusList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { cards } = this.props;

    // temp solution for "finishedOn" date issue (not an ideal one)
    ////////////////
    if (cards[0]) {
      const lastElementIndex = cards.length - 1;
      const lastEl = cards[lastElementIndex];
      if (lastEl.status === 3 && !lastEl.finishedOn) {
        const todaysDate = moment().format("iDD/iMM/iYYYY");
        lastEl.finishedOn = todaysDate;
      } else if (lastEl.status === 2 && lastEl.finishedOn)
        lastEl.finishedOn = undefined;
    }

    let sortedCards = cards.sort((a, b) => {
      if (!a.isPinned && !b.isPinned) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });

    return (
      <Droppable droppableId={String(this.props.listID)}>
        {(provided) => (
          <div ref={provided.innerRef} className="square">
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
                <Col
                  xs={{ span: 12 }}
                  className="text-left"
                  style={{ left: "0" }}
                >
                  <span className="cardsNum">{cards.length}</span>
                </Col>
              </Row>
            </div>
            <div className="sqMenu">{console.log(cards)}
              {sortedCards && cards.length !== 0
                ? sortedCards.map((card, i) => (
                    <Col xs={{ span: 24 }} key={i}>
                      <ScheduleCard MyIndex={i} {...card} />
                    </Col>
                  ))
                : null}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  }
}
