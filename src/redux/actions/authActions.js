import { LOGOUT, SET_CURRENT_USER, ADMIN_OR_EMPLOYEE } from "./rootActions";
import setAuthToken from "../../helpers/setAuthToken";
import jwt_decode from "jwt-decode";
import { canUserObtainManagerStuff } from "../../api/adminApi";
export const Login = (userdata, history) => async (dispatch) => {
  localStorage.setItem("userToken", userdata);
  setAuthToken(userdata);
  const decodedToken = jwt_decode(userdata);
  dispatch(setCurrentUser(decodedToken));
  // dispatch({ type: LOGIN, payload: userdata });
  const userType = await canUserObtainManagerStuff();
  if (userType === "director") history.push("/Tasks-Brief");
  else history.push("/");
  return userType;
};

export const LogOut = () => (dispatch) => {
  localStorage.removeItem("userToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  dispatch({ type: LOGOUT });
};

export const setCurrentUser = (decodedToken) => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedToken,
  };
};
export const adminOrEmployee = (userType) => {
  return async (dispatch) => {
    dispatch({
      type: ADMIN_OR_EMPLOYEE,
      payload: userType ? userType : await canUserObtainManagerStuff(),
    });
  };
};
