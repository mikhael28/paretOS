import { configureStore } from "@reduxjs/toolkit";
import reducer from "./state/index";

const store = configureStore({
  reducer,
});

export { store };
