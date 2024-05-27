// adminstrationSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stateIotList: [],
  districtIotList: [],
  cityIotList: [],
  complexIotList: [],
  complexIotDetail: {},
  clientName: null,
  billingGroups: null,
  complexName: null,
  cabinList: [],
  cabinDetails: null,
  cabinTypeList: [],
  userTypeList: []
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
    setComplexName: (state, action) => {
      state.complexName = action.payload;
    },
    setClientName: (state, action) => {
      state.clientName = action.payload;
    },
    setBillingGroup: (state, action) => {
      state.billingGroups = action.payload;
    },
    setCabinList: (state, action) => {
      state.cabinList = action.payload;
    },
    setCabinDetails: (state, action) => {
      state.cabinDetails = action.payload;
    },
    setCabinTypeList: (state, action) => {
      state.cabinTypeList = action.payload;
    },
    setUserTypeList: (state, action) => {
      state.userTypeList = action.payload;
    },
    setResetData: (state, action) => {
        state.stateIotList = [];
        state.districtIotList = [];
        state.cityIotList = [];
        state.complexIotList = [];
        state.complexIotDetail = {};
        state.clientName = null;
        state.billingGroups = null;
        state.complexName= null
        state.cabinTypeList = [];
        state.userTypeList = [];
    },
  },
});

export const { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail, setResetData,setClientName, setBillingGroup,setComplexName, setCabinList, setCabinDetails , setCabinTypeList,setUserTypeList } =
androidManagementSlice.actions;
export const androidManagementState = (state) => state.androidManagement;

export default androidManagementSlice.reducer;
