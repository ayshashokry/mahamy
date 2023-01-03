import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import promiseMiddleware from "redux-promise";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import { loadState } from "./LocalStorage";
import rootReducer from "./reducers/rootReducer";
const persistedState = loadState();
const middleware = [thunk];
const store = createStore(
  rootReducer,
  persistedState,
  composeWithDevTools(applyMiddleware(promiseMiddleware, ...middleware))
);

export default store;
