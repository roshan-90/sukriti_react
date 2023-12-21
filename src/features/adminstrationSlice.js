// adminstrationSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientList: [],
  teamList: [],
  data: [],
};

const adminstrationSlice = createSlice({
  name: "adminstration",
  initialState: initialState,
  reducers: {
    setTeamList: (state, action) => {
      console.log("setTeamList", action.payload);
      state.teamList = action.payload;
    },
    setClientList: (state, action) => {
      console.log("setClientList");
      state.clientList = action.payload;
    },
    setData: (state, action) => {
      console.log("setData");
      state.data = action.data;
    },
  },
});

export const { setTeamList, setClientList, setData } =
  adminstrationSlice.actions;
export const adminstrationState = (state) => state.adminstration;

export default adminstrationSlice.reducer;
