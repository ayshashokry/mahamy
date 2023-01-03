// import {
//   CLEAR_TASKS_COUNT_IN_CATEGORY,
//   GET_CATEGORIS_STATS,
//   GET_Employees_COUNT,
//   GET_TASKS_COUNT,
//   GET_TASKS_COUNT_IN_CATEGORY,
//   GET_TASKS_IN_CATEGORY,
//   CLEAR_TASKS_IN_CATEGORY,
//   CLEAR_PERFORMANCES,
// } from "../actions/rootActions";

// const intialState = {
//   CategoriesCount: [],
//   TasksCount: [],
//   EmployeesCount: [],
//   TasksInCategory: [],
//   TasksCountInCategory: [],
// };

// const PerformanceReducer = (state = intialState, action) => {
//   switch (action.type) {
//     case GET_CATEGORIS_STATS: {
//       return { ...state, CategoriesCount: action.payload };
//     }
//     // case GET_TASKS_COUNT: {
//     //   return { ...state, TasksCount: action.payload };
//     // }
//     // case GET_Employees_COUNT: {
//     //   return { ...state, EmployeesCount: action.payload };
//     // }
//     // case GET_TASKS_COUNT_IN_CATEGORY: {
//     //   return { ...state, TasksCountInCategory: action.payload };
//     // }
//     // case CLEAR_TASKS_COUNT_IN_CATEGORY: {
//     //   return { ...state, TasksCountInCategory: [] };
//     // }
//     // case GET_TASKS_IN_CATEGORY: {
//     //   return { ...state, TasksInCategory: action.payload };
//     // }
//     // case CLEAR_TASKS_IN_CATEGORY: {
//     //   return { ...state, TasksInCategory: [] };
//     // }
//     // case CLEAR_PERFORMANCES: {
//     //   return { ...state, TasksInCategory: [], TasksCountInCategory: [] };
//     // }
//     default:
//       return state;
//   }
// };
// export default PerformanceReducer;
