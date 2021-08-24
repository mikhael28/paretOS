import { combineReducers } from "redux";
import profile from "./profile";
import sprints from "./sprints";

export default combineReducers({
  profile: profile,
  sprint: sprints,
});
