import {
  GET_STATUS,
  GET_TASKS,
  GET_PRIORITIES,
  GET_OUTPUTS,
  ADD_TASK,
  DELETE_TASK,
  EDIT_ARCHIVE_TASK,
  GET_TASK_DETAILS,
  GET_TEAM_TASKS,
  EDIT_TASK,
  CLEAR_TASK_DETAILS,
  START_TASKS_LOADING,
  FINISH_TASKS_LOADING,
} from "./rootActions";
import { getStatuses } from "../../api/statusApi";
import {
  getTasks,
  saveTask,
  getSingleTask,
  getTeamsTasks,
} from "../../api/tasksApi";
import { getOutputs } from "../../api/taskOutputsApi";
import { getPriorities } from "../../api/prioritiesApi";

export const getStatusList = (statuses) => {
  return async (dispatch) => {
    dispatch({
      type: GET_STATUS,
      payload: Array.isArray(statuses) ? statuses : await getStatuses(),
    });
  };
};
export const getTasksList = (tasks) => {
  return async (dispatch) => {
    dispatch({
      type: GET_TASKS,
      payload: Array.isArray(tasks) ? tasks : await getTasks(),
    });
  };
};
export const getTeamTasksList = (tasks) => {
  return async (dispatch) => {
    dispatch({
      type: GET_TEAM_TASKS,
      payload: Array.isArray(tasks) ? tasks : await getTeamsTasks(),
    });
  };
};
export const deleteTheTask = (id) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_TASK, payload: id });
  };
};

export const getTaskDetails = (id) => {
  return async (dispatch) => {
    dispatch({ type: GET_TASK_DETAILS, payload: await getSingleTask(id) });
  };
};
export const clearTaskDetails = (id) => {
  return {
    type: CLEAR_TASK_DETAILS,
    payload: {},
  };
};

export const getPrioritiesList = (priorities) => {
  return async (dispatch) => {
    dispatch({
      type: GET_PRIORITIES,
      payload: Array.isArray(priorities) ? priorities : await getPriorities(),
    });
  };
};
export const getOutputsList = (outputs) => {
  return async (dispatch) => {
    dispatch({
      type: GET_OUTPUTS,
      payload: Array.isArray(outputs) ? outputs : await getOutputs(),
    });
  };
};
export const addNewTask = (data) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TASK, payload: await saveTask(data) });
  };
};
export const editTask = (data, callApi = true, operation = "replace") => {
  return async (dispatch) => {
    dispatch({
      type: EDIT_TASK,
      operation,
      payload: callApi ? await saveTask(data) : data,
    });
  };
};
export const editArchivedTask = (
  data,
  callApi = true,
  operation = "replace"
) => {
  return async (dispatch) => {
    dispatch({
      type: EDIT_ARCHIVE_TASK,
      operation,
      payload: callApi ? await saveTask(data) : data,
    });
  };
};

export const startTasksLoading = () => (dispatch) => {
  dispatch({ type: START_TASKS_LOADING });
};

export const finishTasksLoading = () => (dispatch) => {
  dispatch({ type: FINISH_TASKS_LOADING });
};
