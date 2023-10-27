import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import messageReducer from "./messageSlice";

/**
 * A configure class for all the global states
 */
const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
  },
});

export default store