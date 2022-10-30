import { createSelector } from "@reduxjs/toolkit";
import { User } from "../../../types/ProfileTypes";
import { ReduxRootState } from "../../state";

const selectProfile = createSelector(
  (state: ReduxRootState) => state.profile,
  (user: User) => user
);

export { selectProfile };
