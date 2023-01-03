import { SWITCH_USER } from "../actions/rootActions";

const UserReducer = (state = {}, action) => {
  switch (action.type) {
    case SWITCH_USER: {
      return action.payload;
    }

    default:
      return state;
  }
};
export default UserReducer;
