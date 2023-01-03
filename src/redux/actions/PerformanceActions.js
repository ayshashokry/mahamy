// import {
//   GET_CATEGORIS_STATS,
//   GET_Employees_COUNT,
//   GET_TASKS_COUNT,
//   GET_TASKS_COUNT_IN_CATEGORY,
//   CLEAR_TASKS_COUNT_IN_CATEGORY,
//   GET_TASKS_IN_CATEGORY,
//   CLEAR_TASKS_IN_CATEGORY,
//   CLEAR_PERFORMANCES,
// } from "./rootActions";
// import {
//   getCategoriesStatistics,
//   // getEmployeesTasksCount,
//   // getFinishedTasksStatsByCategory,
//   // getTasksStatusCount,
//   // getTasksStatusCountByCategory,
// } from "../../api/statisticsApi";

// export const getCategoriesStats = () => {
//   return async (dispatch) => {
//     dispatch({
//       type: GET_CATEGORIS_STATS,
//       payload: await getCategoriesStatistics(),
//     });
//   // };
// };

// // export const getTasksCounts = () => {
// //   return async (dispatch) => {
// //     dispatch({
// //       type: GET_TASKS_COUNT,
// //       payload: await getTasksStatusCount(),
// //     });
// //   };
// // };

// // export const getEmployeesCounts = () => {
// //   return async (dispatch) => {
// //     dispatch({
// //       type: GET_Employees_COUNT,
// //       payload: await getEmployeesTasksCount(),
// //     });
// //   };
// // };

// // export const getTasksCountWithCategory = (id, data) => {
// //   return async (dispatch) => {
// //     dispatch({
// //       type: GET_TASKS_COUNT_IN_CATEGORY,
// //       payload: data ? data : await getTasksStatusCountByCategory(id),
// //     });
// //   };
// // };

// // export const clearTasksCountWithCategory = () => {
// //   return async (dispatch) => {
// //     dispatch({
// //       type: CLEAR_TASKS_COUNT_IN_CATEGORY,
// //       payload: {},
// //     });
// //   };
// // };

// // export const getTasksWithCategory = (id, data) => {
// //   return async (dispatch) => {
// //     dispatch({
// //       type: GET_TASKS_IN_CATEGORY,
// //       payload: data ? data : await getFinishedTasksStatsByCategory(id),
// //     });
// //   };
// // };

// // export const clearTasksWithCategory = () => {
// //   return async (dispatch) => {
// //     dispatch({
// //       type: CLEAR_TASKS_IN_CATEGORY,
// //       payload: {},
// //     });
// //   };
// // };

// // export const ClearPerformances = () => {
// //   return async (dispatch) => {
// //     dispatch({
// //       type: CLEAR_PERFORMANCES,
// //       payload: {},
// //     });
// //   };
// // };
