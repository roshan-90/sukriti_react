// adminstrationSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendorList: [],
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
    setVendorList: (state, action) => {
      console.log("setVendorList");
    },
    setData: (state, action) => {
      console.log("setData");
    },
  },
});

export const { setTeamList, setVendorList, setData } =
  adminstrationSlice.actions;
export const adminstrationState = (state) => state.adminstration;

export default adminstrationSlice.reducer;
