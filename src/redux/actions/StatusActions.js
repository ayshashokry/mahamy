import {
  GET_SCHEDULE_STATUS,
  CLEAR_STATUS,
  GET_SCHEDULE_CARDS,
  DRAG_HAPPENED,
  START_TASK,
  FINISH_TASK,
  ARCHIVE_TASK,
  PIN_TASK,
  UN_PIN_TASK,
  RE_START_TASK,
  GET_TEAMS_CARDS,
  REFINISH_TASK,
} from "./rootActions";
import { getStatuses } from "../../api/statusApi";
import {
  getTasks,
  startTask,
  reStartTask,
  finishTask,
  archiveTask,
  pinUnpinTask,
  getTeamsTasks,
} from "../../api/tasksApi";

export const getScheduleStatuses = () => {
  return async (dispatch) => {
    let statusHolder = await getStatuses();
    let Statuses = statusHolder.map((x) => {
      let name = x.name;
      let id = x.id;
      let cards = [];
      return {
        name,
        id,
        cards,
      };
    });

    dispatch({ type: GET_SCHEDULE_STATUS, payload: Statuses });
  };
};

export const getTeamsCards = (tasks, statuses) => {
  return async (dispatch) => {
    let statusHolder =
      statuses && statuses.length > 0 ? statuses : await getStatuses();
    let teamstasksHolder =
      tasks && tasks.length ? tasks : await getTeamsTasks();
    let Statuses = statusHolder.map((x) => {
      let name = x.name;
      let id = x.id;
      let cards = [];
      return {
        name,
        id,
        cards,
      };
    });
    Statuses.forEach((s) => {
      teamstasksHolder.forEach((task) => {
        if (task.status === s.id) {
          if (task.isPinned) {
            s.cards.unshift(task);
          } else {
            s.cards.push(task);
          }
        }
      });
    });
    dispatch({ type: GET_TEAMS_CARDS, payload: Statuses });
  };
};

export const getScheduleCards = (tasks) => {
  return async (dispatch) => {
    let statusHolder = await getStatuses();
    let TasksHolder = tasks ? tasks : await getTasks();
    let Statuses = statusHolder.map((x) => {
      let name = x.name;
      let id = x.id;
      let cards = [];
      return {
        name,
        id,
        cards,
      };
    });
    Statuses.forEach((s) => {
      TasksHolder.forEach((task) => {
        if (task.status === s.id) {
          if (task.isPinned) {
            s.cards.unshift(task);
          } else {
            s.cards.push(task);
          }
        }
      });
    });
    dispatch({ type: GET_SCHEDULE_CARDS, payload: Statuses });
  };
};

export const pinTask = (id, pin, status) => {
  return async (dispatch) => {
    await pinUnpinTask(id, pin);
    dispatch({ type: PIN_TASK, payload: { id, status } });
  };
};
export const unPinTask = (id, pin, status) => {
  return async (dispatch) => {
    await pinUnpinTask(id, pin);
    dispatch({ type: UN_PIN_TASK, payload: { id, status } });
  };
};

export const clearStatuses = () => {
  return {
    type: CLEAR_STATUS,
    payload: {},
  };
};

export const startTasks = (id, response) => {
  return async (dispatch) => {
    const task = response ? response : await startTask(id);
    //dispatch({ type: START_TASK, payload: { id } });
    dispatch({ type: START_TASK, payload: task });
  };
};
export const reStartTasks = (id, response) => {
  return async (dispatch) => {
    const task = response ? response : await reStartTask(id);
    //dispatch({ type: RE_START_TASK, payload: { id } });
    dispatch({ type: RE_START_TASK, payload: task });
  };
};

export const reFinishTasks = (id, response) => {
  return async (dispatch) => {
    const task = response ? response : await startTask(id);
    //dispatch({ type: REFINISH_TASK, payload: { id } });
    dispatch({ type: REFINISH_TASK, payload: task });
  };
};

export const archiveTasks = (id) => {
  return async (dispatch) => {
    await archiveTask(id);
    dispatch({ type: ARCHIVE_TASK, payload: { id, isArchived: true } });
  };
};
export const finishTasks = (id, response) => {
  return async (dispatch) => {
    const task = response ? response : await finishTask(id);
    //dispatch({ type: FINISH_TASK, payload: { id } });
    dispatch({ type: FINISH_TASK, payload: task });
  };
};
export const dragDrop = (
  droppableIdStart,
  droppableIdEnd,
  droppableIndexStart,
  droppableIndexEnd,
  draggableId
) => {
  return {
    type: DRAG_HAPPENED,
    payload: {
      droppableIdStart,
      droppableIdEnd,
      droppableIndexStart,
      droppableIndexEnd,
      draggableId,
    },
  };
};
