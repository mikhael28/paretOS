import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/ProfileTypes";

export const GET_USER = "GET_USER";
export const SET_SUMMARY = "SET_SUMMARY";

const initialState: any = {
  projects: [],
};

export const getUserAction = createAction(GET_USER, (sprint: any[]) => ({
  payload: sprint,
}));

export const setUserAction = createAction(SET_SUMMARY, (user: User) => ({
  payload: user,
}));

const profileReducer = createReducer<User>(initialState, (builder) => {
  builder
    .addCase(getUserAction, (state, action: PayloadAction<User>) => {
      state = action.payload;
      return state;
    })
    .addCase(setUserAction, (state, action: PayloadAction<User>) => {
      state = action.payload;
      return state;
    });
});

export default profileReducer;
