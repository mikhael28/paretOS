import { combineReducers } from "redux";
import profile from "./profile";
import sprints from "./sprints";
import { Sprint, User } from "../types";

export interface ReduxRootState {
  profile: User;
  sprint: Sprint[];
}

export default combineReducers({
  profile: profile,
  sprint: sprints,
});
