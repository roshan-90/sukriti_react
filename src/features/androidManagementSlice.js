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
  userTypeList: [],
  cabinName: null,
  listOfPolicy: null,
  policyName: null,
  policyDetails: null,
  listEnterprise: null,
  selectedOptionEnterprise: null,
  listDevice: null,
  selectedDevice: null,
  enterpriseDetail: null,
  logoList: [],
  wifiList: []
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
    setCabinName: (state, action) => {
      state.cabinName = action.payload;
    },
    setListOfPolicy: (state, action) => {
      state.listOfPolicy = action.payload;
    },
    setPolicyName: (state, action) => {
      state.policyName = action.payload;
    },
    setPolicyDetails: (state, action) => {
      state.policyDetails = action.payload
    },
    setListEnterprise: (state, action) => {
      state.listEnterprise = action.payload;
    },
    setSelectedOptionEnterprise: (state, action) => {
      state.selectedOptionEnterprise = action.payload;
    },
    setListDevice: (state, action) => {
      state.listDevice = action.payload;
    },
    setSelectedDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
    setEnterpriseDetail: (state, action) => {
      state.enterpriseDetail = action.payload;
    },
    setlogoList: (state, action) => {
      state.logoList  = action.payload;
    },
    setwifiList: (state, action) => {
      state.wifiList = action.payload;
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
        state.cabinList = [];
        state.cabinDetails = null;
        state.cabinTypeList = [];
        state.userTypeList = [];
        state.cabinName = null
        state.listOfPolicy = {};
        state.policyName = null;
        state.policyDetails = null;
        state.listEnterprise= null;
        state.selectedOptionEnterprise= null;
        state.listDevice= null;
        state.selectedDevice= null;
        state.enterpriseDetail = null;
        state.logoList = [];
        state.wifiList = [];
    },
  },
});

export const { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail, setResetData,setClientName, setBillingGroup,setComplexName, setCabinList, setCabinDetails , setCabinTypeList,setUserTypeList,setCabinName,setListOfPolicy,setPolicyName, setListEnterprise, setSelectedOptionEnterprise , setListDevice , setSelectedDevice, setPolicyDetails, setEnterpriseDetail, setlogoList, setwifiList} =
androidManagementSlice.actions;
export const androidManagementState = (state) => state.androidManagement;

export default androidManagementSlice.reducer;
