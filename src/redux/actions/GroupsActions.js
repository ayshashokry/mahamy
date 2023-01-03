import { getGroups, getUsersInGroup } from "../../api/groupsApi";
import {
  CLEAR_ALL_EMP,
  CLEAR_EMP_IN_GROUP,
  GET_EMP_IN_GROUP,
  GET_GROUPS,
} from "./rootActions";
export const getGroupsList = (groups) => {
  return async (dispatch) => {
    dispatch({
      type: GET_GROUPS,
      payload: Array.isArray(groups) ? groups : await getGroups(),
    });
  };
};

export const getEmpList = (id) => {
  return async (dispatch) => {
    let usersInGroup = await getUsersInGroup(id);
    usersInGroup.forEach((u) => {
      u.groupId = id;
    });
    dispatch({ type: GET_EMP_IN_GROUP, payload: usersInGroup });
  };
};

export const clearEmpList = (id) => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_EMP_IN_GROUP, payload: id });
  };
};

export const clearAllEmp = () => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_ALL_EMP, payload: [] });
  };
};
