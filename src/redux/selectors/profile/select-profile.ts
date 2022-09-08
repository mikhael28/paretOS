import { createSelector } from "@reduxjs/toolkit";
import { userInfo } from "os";
import { User } from "../../../types/ProfileTypes";
import { ReduxRootState } from "../state";
import { Sprint } from "../types";

const selectProfile = createSelector(
  (state: ReduxRootState) => state.profile,
  (user: User) => user
);

export { selectProfile };
