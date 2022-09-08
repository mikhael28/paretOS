import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { DispatchProp } from "react-redux";
import { AnyAction } from "redux";
import { Sprint } from "../types/ArenaTypes";
import { User } from "../types/ProfileTypes";
import { getActiveSprintDataAction } from "./sprints";

export const GET_USER = "GET_USER";
export const SET_SUMMARY = "SET_SUMMARY";

const initialState = null;

export const getUserAction = createAction(GET_USER, (sprint: any[]) => ({
  payload: sprint,
}));

export const setUserAction = createAction(SET_SUMMARY, (user: User) => ({
  payload: user,
}));

const profileReducer = createReducer<User>(null, (builder) => {
  builder
    .addCase(getUserAction, (state, action: PayloadAction<User>) => {
      console.log({ stateSuperior: state, action });
      state = action.payload;
      return state;
    })
    .addCase(setUserAction, (state, action: PayloadAction<User>) => {
      //state[] = action.payload;

      console.log({ state, action });

      state = action.payload;

      return state;

      /* const index = state?.findIndex(
        (user) => user.id === action.payload.profileId
      );
      if (index >= 0) state[index].summary = action.payload.summary; */
    });
});

/* function profile(state = initialState, action: AnyAction) {
  switch (action.type) {
    case GET_USER:
      return { ...action.user };
    default:
      return state;
  }
} */

/* export function getUser(user: User) {
  return { type: GET_USER, user };
}
 */
export default profileReducer;
