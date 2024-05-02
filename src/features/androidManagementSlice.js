// adminstrationSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stateIotList: [],
  districtIotList: [],
  cityIotList: [],
  complexIotList: [],
  complexIotDetail: {}
};

const androidManagementSlice = createSlice({
  name: "androidManagement",
  initialState: initialState,
  reducers: {
    setStateIotList: (state, action) => {
      state.stateIotList = action.payload;
    },
    setDistrictIotList: (state, action) => {
      state.districtIotList = action.payload;
    },
    setCityIotList: (state, action) => {
      state.cityIotList = action.payload;
    },
    setComplexIotList: (state, action) => {
        state.complexIotList = action.payload;
    },
    setComplexIotDetail: (state, action) => {
        state.complexIotDetail = action.payload;
    },
    setResetData: (state, action) => {
        state.stateIotList = [];
        state.districtIotList = [];
        state.cityIotList = [];
        state.complexIotList = [];
        state.complexIotDetail = {};
    },
  },
});

export const { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail, setResetData } =
androidManagementSlice.actions;
export const androidManagementState = (state) => state.androidManagement;

export default androidManagementSlice.reducer;
