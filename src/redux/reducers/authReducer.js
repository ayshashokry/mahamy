import {
  LOGIN,
  LOGOUT,
  SET_CURRENT_USER,
  ADMIN_OR_EMPLOYEE,
} from "../actions/rootActions";
import isEmpty from "../../helpers/is-Empty";
const initialState = {
  isAuth: false,
  user: {},
  admin: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      console.log(action.payload);
      return { ...state, isAuth: true, user: action.payload };

    case LOGOUT:
      return { isAuth: false, user: {}, admin: "" };

    case SET_CURRENT_USER:
      const payload = action.payload;
      let unique_name = "";
      // array.some returns earlier than array.forEach,
      // if a match is found.
      Object.keys(payload).some((k) => {
        if (k.endsWith("/claims/name")) {
          unique_name = payload[k];
          return true;
        }
        return false;
      });
      return {
        ...state,
        isAuth: !isEmpty(payload),
        user: { ...payload, unique_name },
      };
    case ADMIN_OR_EMPLOYEE:
      return {
        ...state,
        admin: action.payload,
      };

    default:
      return state;
  }
};
export default authReducer;
