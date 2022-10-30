import { combineReducers } from "redux";
import profile from "./profile";
import sprints from "./sprints";
import { Sprint } from "../../types/ArenaTypes";
import { User } from "../../types/ProfileTypes";

export interface ReduxRootState {
  profile: User;
  sprint: Sprint[];
}

export default combineReducers({
  profile: profile,
  sprint: sprints,
});
