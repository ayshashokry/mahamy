import {
  GET_GROUPS,
  GET_EMP_IN_GROUP,
  CLEAR_EMP_IN_GROUP,
  CLEAR_ALL_EMP,
} from "../actions/rootActions";
const initialState = {
  Groups: [],
  Employess: [],
};
const GroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS: {
      return { ...state, Groups: action.payload };
    }
    case GET_EMP_IN_GROUP: {
      let x = [...state.Employess, ...action.payload];
      var flags = [],
        output = [],
        l = x.length,
        i;
      for (i = 0; i < l; i++) {
        if (flags[x[i].id]) continue;
        flags[x[i].id] = true;
        output.push(x[i]);
      }

      return { ...state, Employess: output };
    }
    case CLEAR_EMP_IN_GROUP: {
      let x = state.Employess.filter((obj) => obj.groupId !== action.payload);
      return { ...state, Employess: x };
    }
    case CLEAR_ALL_EMP: {
      return { ...state, Employess: action.payload };
    }
    default:
      return state;
  }
};
export default GroupsReducer;
