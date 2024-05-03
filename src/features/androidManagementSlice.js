// adminstrationSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stateIotList: [],
  districtIotList: [],
  cityIotList: [],
  complexIotList: [],
  complexIotDetail: {},
  clientName: null,
  billingGroups: null
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
    setClientName: (state, action) => {
      state.clientName = action.payload;
    },
    setBillingGroup: (state, action) => {
      state.billingGroups = action.payload;
    },
    setResetData: (state, action) => {
        state.stateIotList = [];
        state.districtIotList = [];
        state.cityIotList = [];
        state.complexIotList = [];
        state.complexIotDetail = {};
        state.clientName = null;
        state.billingGroups = null;
    },
  },
});

export const { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail, setResetData,setClientName, setBillingGroup} =
androidManagementSlice.actions;
export const androidManagementState = (state) => state.androidManagement;

export default androidManagementSlice.reducer;
