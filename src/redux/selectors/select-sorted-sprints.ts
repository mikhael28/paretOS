import { createSelector } from "@reduxjs/toolkit";
import { ReduxRootState } from "../../redux/state";
import { Sprint } from "../types";

const selectSortedSprints = createSelector(
  (state: ReduxRootState) => state.sprint,
  (sprints: Sprint[]) =>
    sprints
      .slice()
      .sort(
        (a: Sprint, b: Sprint) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )
);

export { selectSortedSprints };
