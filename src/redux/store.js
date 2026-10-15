import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});