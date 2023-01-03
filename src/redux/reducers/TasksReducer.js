import {
  GET_TASKS,
  GET_PRIORITIES,
  GET_OUTPUTS,
  GET_TASK_DETAILS,
  GET_STATUS,
  ADD_TASK,
  EDIT_ARCHIVE_TASK,
  EDIT_TASK,
  CLEAR_TASK_DETAILS,
  DELETE_TASK,
  GET_TEAM_TASKS,
  START_TASKS_LOADING,
  FINISH_TASKS_LOADING,
} from "../actions/rootActions";

const intialState = {
  Status: [],
  TaskDetails: [],
  Tasks: [],
  TeamsTasks: [],
  Priorities: [],
  OutPuts: [],
  ArchivedTasks: [],
  delayTasks: [],
  newTasks: [],
  todayTasks: [],
  pagesCount: 0,
  isLoading: false,
};

const TasksReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_STATUS: {
      return { ...state, Status: action.payload };
    }
    case GET_TASKS: {
      return { ...state, Tasks: action.payload };
    }
    case GET_TEAM_TASKS: {
      return { ...state, TeamsTasks: action.payload };
    }
    case DELETE_TASK: {
      const taskId = Number(action.payload);
      const tasks = state.Tasks.filter((t) => t.id !== taskId);
      const teamsTasks = state.TeamsTasks.filter((t) => t.id !== taskId);
      return { ...state, Tasks: tasks, TeamsTasks: teamsTasks };
    }

    case GET_PRIORITIES: {
      return { ...state, Priorities: action.payload };
    }
    case GET_TASK_DETAILS: {
      return { ...state, TaskDetails: action.payload };
    }
    case CLEAR_TASK_DETAILS: {
      return { ...state, TaskDetails: action.payload };
    }

    case GET_OUTPUTS: {
      return { ...state, OutPuts: action.payload };
    }
    case ADD_TASK: {
      return {
        ...state,
        Tasks: [...state.Tasks, action.payload],
        TeamsTasks: [...state.TeamsTasks, action.payload],
      };
    }

    // case START_HOME_TASK: {
    //   if (action.payload.dueDate === todayDate) {
    //     const remainTasks = state.todayTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     remainTasks.splice(
    //       state.todayTasks.findIndex((el) => el.id === Number(action.payload.id)),
    //       0,
    //       action.payload
    //     );
    //     return { ...state, todayTasks: remainTasks };
    //   }
    //   if (action.payload.dueDate < todayDate) {
    //     const remainTasks = state.delayTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     remainTasks.splice(
    //       state.delayTasks.findIndex((el) => el.id === Number(action.payload.id)),
    //       0,
    //       action.payload
    //     );
    //     return { ...state, delayTasks: remainTasks };
    //   }
    //   if (action.payload.dueDate > todayDate) {
    //     const remainTasks = state.newTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     remainTasks.splice(
    //       state.newTasks.findIndex((el) => el.id === Number(action.payload.id)),
    //       0,
    //       action.payload
    //     );
    //     return { ...state, newTasks: remainTasks };
    //   }
    // }
    // case FINISH_HOME_TASK: {
    //   if (action.payload.dueDate === todayDate) {
    //     const remainTasks = state.todayTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     remainTasks.splice(
    //       state.todayTasks.findIndex((el) => el.id === Number(action.payload.id)),
    //       0,
    //       action.payload
    //     );
    //     return { ...state, todayTasks: remainTasks };
    //   }
    //   if (action.payload.dueDate < todayDate) {
    //     const remainTasks = state.delayTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     remainTasks.splice(
    //       state.delayTasks.findIndex((el) => el.id === Number(action.payload.id)),
    //       0,
    //       action.payload
    //     );
    //     return { ...state, delayTasks: remainTasks };
    //   }
    //   if (action.payload.dueDate > todayDate) {
    //     const remainTasks = state.newTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     remainTasks.splice(
    //       state.newTasks.findIndex((el) => el.id === Number(action.payload.id)),
    //       0,
    //       action.payload
    //     );
    //     return { ...state, newTasks: remainTasks };
    //   }
    // }

    // case ARCHIVE_HOME_TASK: {
    //   if (action.payload.dueDate === todayDate) {
    //     const remainTasks = state.todayTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     return { ...state, todayTasks: remainTasks };
    //   }
    //   if (action.payload.dueDate < todayDate) {
    //     const remainTasks = state.delayTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     return { ...state, delayTasks: remainTasks };
    //   }
    //   if (action.payload.dueDate > todayDate) {
    //     const remainTasks = state.newTasks.filter(
    //       (task) => task.id !== Number(action.payload.id)
    //     );
    //     return { ...state, newTasks: remainTasks };
    //   }
    // }
    // case CLEAR_HOME_TASKS: {
    //   return { ...state, delayTasks: [], newTasks: [], todayTasks: [] };
    // }
    case EDIT_TASK: {
      const remainTasks = state.Tasks.filter(
        (task) => task.id !== Number(action.payload.id)
      );
      const index = state.Tasks.findIndex(
        (el) => el.id === Number(action.payload.id)
      );
      const task = state.Tasks[index];
      remainTasks.splice(
        index,
        0,
        action.operation === "patch"
          ? { ...task, ...action.payload }
          : action.payload
      );

      return { ...state, Tasks: remainTasks };
    }

    case EDIT_ARCHIVE_TASK: {
      const remainTeamsTasks = state.TeamsTasks.filter(
        (task) => task.id !== Number(action.payload.id)
      );
      const teamsTaskIndex = state.TeamsTasks.findIndex(
        (el) => el.id === Number(action.payload.id)
      );
      const teamsTask = state.TeamsTasks[teamsTaskIndex];
      remainTeamsTasks.splice(
        teamsTaskIndex,
        0,
        action.operation === "patch"
          ? { ...teamsTask, ...action.payload }
          : action.payload
      );

      const remainTasks = state.Tasks.filter(
        (task) => task.id !== Number(action.payload.id)
      );
      const index = state.Tasks.findIndex(
        (el) => el.id === Number(action.payload.id)
      );
      if (index > -1) {
        const task = state.Tasks[index];
        remainTasks.splice(
          index,
          0,
          action.operation === "patch"
            ? { ...task, ...action.payload }
            : action.payload
        );
      }

      return { ...state, Tasks: remainTasks, TeamsTasks: remainTeamsTasks };
    }

    case START_TASKS_LOADING:
      return { ...state, isLoading: true };

    case FINISH_TASKS_LOADING:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};
export default TasksReducer;
