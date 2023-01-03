import React, { Component } from "react";
import { connect } from "react-redux";
import EmployeeStatusList from "./EmployeeStatusList";
import {
  getScheduleStatuses,
  clearStatuses,
  dragDrop,
  startTasks,
  reStartTasks,
  finishTasks,
} from "../../redux/actions/StatusActions";
import { getTeamTasksList, editTask } from "../../redux/actions/TasksActions";
import { finishTask, startTask, reStartTask } from "../../api/tasksApi";

class EmployeeListsHolder extends Component {
  componentDidMount() {
    //this.props.getScheduleStatuses();
    //this.props.getTeamTasksList();
  }

  componentWillUnmount() {
    this.props.clearStatuses();
  }
  render() {
    const { Statuses } = this.props;

    return (
      // <DragDropContext onDragEnd={this.onDragEnd}>
      <div className="squares">
        {Statuses.length !== 0
          ? Statuses.map((status, index) => (
              <EmployeeStatusList
                userId={this.props.userId}
                searchvalue={this.props.searchvalue}
                listID={status.id}
                key={index}
                index={index}
                title={status.name}
                cards={status.cards}
              />
              // </Col>
            ))
          : null}
      </div>
      // </DragDropContext>
    );
  }
}
const mapStateToProps = (state) => ({
  Statuses: state.ScheculeStatuses,
  Tasks: state.Tasks.Tasks,
  userId:
    state.auth.user[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ],
});

const mapDispatchToProps = {
  getScheduleStatuses,
  clearStatuses,
  dragDrop,
  startTasks,
  finishTasks,
  //getTasksList,
  getTeamTasksList,

  editTask,
  reStartTasks,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeListsHolder);
