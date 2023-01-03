import {
  GET_CATEGORIES,
  ADD_CATEGORY,
  GET_CATEGORY_DETAILS,
  GET_FLAT_CATEGORIES,
  DELETE_CATEGORY,
  EDIT_CATEGOTY,
} from "./rootActions";
import {
  getCategories,
  getSingleCategory,
  saveCategory,
  getFlatCategories,
} from "../../api/categoriesApi";

export const getCategoriesList = (categories) => {
  return async (dispatch) => {
    dispatch({
      type: GET_CATEGORIES,
      payload: Array.isArray(categories) ? categories : await getCategories(),
    });
  };
};
export const getFlatCategoriesList = (categories) => {
  return async (dispatch) => {
    dispatch({
      type: GET_FLAT_CATEGORIES,
      payload: Array.isArray(categories)
        ? categories
        : await getFlatCategories(),
    });
  };
};
export const getCategoryDetails = (id) => async (dispatch) => {
  return {
    type: GET_CATEGORY_DETAILS,
    payload: await getSingleCategory(id),
  };
};
export const addCategory = (data) => {
  return async (dispatch) => {
    dispatch({ type: ADD_CATEGORY, payload: await saveCategory(data) });
  };
};
export const deleteTheCategory = (id) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_CATEGORY, payload: id });
  };
};
export const editCategory = (data, callApi = true, operation = "replace") => {
  return async (dispatch) => {
    dispatch({
      type: EDIT_CATEGOTY,
      operation,
      payload: callApi ? await saveCategory(data) : data,
    });
  };
};
