import { DispatchProp } from "react-redux";
import { AnyAction } from "redux";
import { User } from "../types";

export const GET_USER = "GET_USER";

const initialState = null;
function profile(state = initialState, action: AnyAction) {
  switch (action.type) {
    case GET_USER:
      return { ...action.user };
    default:
      return state;
  }
}

export function getUser(user: User) {
  return { type: GET_USER, user };
}

export default profile;
