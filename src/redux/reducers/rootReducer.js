import { combineReducers } from "redux";
import CategoriesReducer from "./CategoriesReducer";
import GroupsReducer from "./GroupsReducer";
import TasksReducer from "./TasksReducer";
import StatusReducer from "./StatusReducer";
import PerformanceReducer from "./PerformanceReducer";
import UserReducer from "./UserReducer";
import authReducer from "./authReducer";
const rootReducer = combineReducers({
  Categories: CategoriesReducer,
  Groups: GroupsReducer,
  Tasks: TasksReducer,
  ScheculeStatuses: StatusReducer,
  Indicators: PerformanceReducer,
  User: UserReducer,
  auth: authReducer,
});

export default rootReducer;
