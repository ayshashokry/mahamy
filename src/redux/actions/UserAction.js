import { SWITCH_USER } from "./rootActions";

export const changeUser = () => {
  return async dispatch => {
    const user = await fetch(process.env.PUBLIC_URL + "/user.txt").then(x =>
      x.text()
    );
    dispatch({ type: SWITCH_USER, payload: user });
  };
};
