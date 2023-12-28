import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {};

// Create a slice using createSlice
const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    pushComponentProps: (state, action) => {
      const { key, componentProps } = action.payload;
      state[key] = componentProps;
    },
    removeComponentProps: (state, action) => {
      const { key } = action.payload;
      delete state[key];
    },
  },
});

// Export the reducer and actions
export const { pushComponentProps, removeComponentProps } =
  historySlice.actions;
export default historySlice.reducer;
