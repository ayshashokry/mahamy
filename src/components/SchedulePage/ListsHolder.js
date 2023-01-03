import React, { Component } from "react";
import { connect } from "react-redux";
import StatusList from "./StatusList";
import {
  getScheduleStatuses,
  clearStatuses,
  dragDrop,
  startTasks,
  reStartTasks,
  finishTasks,
  reFinishTasks,
} from "../../redux/actions/StatusActions";
import {
  getTasksList,
  getTeamTasksList,
  editTask,
} from "../../redux/actions/TasksActions";
import { DragDropContext } from "react-beautiful-dnd";
import PreLoading from "../layout/PreLoading";
import { finishTask, reStartTask, startTask } from "../../api/tasksApi";
import { notification } from "antd";
class ListHolder extends Component {
  state = { loading: false };

  componentDidMount() {
    this.props.getScheduleStatuses();
    this.props.getTasksList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.admin !== this.props.admin)
      if (this.props.admin === true) this.props.getTeamTasksList();
  }

  onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    this.setState({ loading: true }, async () => {
      if (!destination) {
        return;
      }
      this.props.dragDrop(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index,
        draggableId
      );
      if (source.droppableId == 1 && destination.droppableId == 2) {
        try {
          const task = await startTask(draggableId);
          this.props.startTasks(draggableId, task);
          this.props.editTask(
            { id: Number(draggableId), status: 2 },
            false,
            "patch"
          );
        } catch (error) {
          this.showErrorNotification(error.message);
        }
      }

      if (source.droppableId == 2 && destination.droppableId == 3) {
        try {
          const task = await finishTask(draggableId);
          this.props.finishTasks(draggableId, task);
          this.props.editTask(
            { id: Number(draggableId), status: 3 },
            false,
            "patch"
          );
        } catch (error) {
          this.showErrorNotification(error.message);
        }
      }
      if (source.droppableId == 3 && destination.droppableId == 2) {
        try {
          const task = await startTask(draggableId);
          this.props.reFinishTasks(draggableId, task);
          this.props.editTask(
            { id: Number(draggableId), status: 2 },
            false,
            "patch"
          );
        } catch (error) {
          this.showErrorNotification(error.message);
        }
      }
      if (source.droppableId == 2 && destination.droppableId == 1) {
        try {
          const task = await reStartTask(draggableId);
          this.props.reStartTasks(draggableId, task);
          this.props.editTask(
            { id: Number(draggableId), status: 1 },
            false,
            "patch"
          );
        } catch (error) {
          this.showErrorNotification(error.message);
        }
      }

      this.setState({ loading: false });
    });

    console.log(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
      draggableId
    );
  };
  showErrorNotification(msg) {
    notification.error({
      description: msg,
      duration: 5,
    });
  }

  componentWillUnmount() {
    this.props.clearStatuses();
  }
  render() {
    const { Statuses, TeamsTasks, userId, admin } = this.props;
    const { loading } = this.state;
    const managerSpecificTasksIds = TeamsTasks.filter(
      (t) =>
        t.employees.length == 1 && t.employees[0].employeeId == Number(userId)
    ).map((t) => t.id);
    if (Statuses[2] && admin) {
      const finishedTasks = Statuses[2].cards;
      finishedTasks.forEach((t) => {
        if (managerSpecificTasksIds.includes(t.id)) t.isManagerSpecific = true;
      });
    }

    return loading ? (
      <PreLoading />
    ) : (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="squares">
          {Statuses.length !== 0
            ? Statuses.map((status, index) => (
                // <Col
                //   xl={{ span: 8 }}
                //   md={{ span: 8 }}
                //   xs={{ span: 8 }}
                //   key={index}
                // >
                <StatusList
                  key={index}
                  searchvalue={this.props.searchvalue}
                  listID={status.id}
                  index={index}
                  title={status.name}
                  cards={status.cards}
                />
                // </Col>
              ))
            : null}
        </div>
      </DragDropContext>
    );
  }
}
const mapStateToProps = (state) => ({
  Statuses: state.ScheculeStatuses,
  TeamsTasks: state.Tasks.TeamsTasks,
  admin: state.auth.admin,
  userId:
    state.auth.user[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ],
  ScheculeStatuses: state.ScheculeStatuses,
});

const mapDispatchToProps = {
  getScheduleStatuses,
  clearStatuses,
  dragDrop,
  startTasks,
  finishTasks,
  getTasksList,
  getTeamTasksList,
  editTask,
  reStartTasks,
  reFinishTasks,
};
export default connect(mapStateToProps, mapDispatchToProps)(ListHolder);
