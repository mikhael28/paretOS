import { createSelector } from "@reduxjs/toolkit";
import { User } from "../../../types/ProfileTypes";
import { selectProfile } from "./select-profile";

const selectSummary = createSelector(
  selectProfile,
  (user: User) => user.summary
);

export { selectSummary };
