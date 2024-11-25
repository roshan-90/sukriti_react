import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasData: false,
  data: {},
  configData: {},
  selectionView: { label: "Summary View", value: "Summary View" },
  selectParentFrequency: { label: "20 Sec", value: 20000 },
  RecycleViewData: null
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.hasData = true;
      state.data = action.payload;
    },
    setDashboardConfig: (state, action) => {
      state.hasData = true;
      state.configData = action.payload.dashboardConfig;
    },
    setDashboardLive: (state, action) => {
      console.log('like', action.payload);
      state.hasData = true;
      state.configData = action.payload;
    },
    setDashboardView: (state, action) => {
      state.selectionView = action.payload;
    },
    setRecycleViewData: (state, action) => {
      state.RecycleViewData = action.payload;
    },
    setSelectParentFrequency: (state, action) => {
      state.selectParentFrequency = action.payload;
    }
  },
});

export const { setDashboardData, setDashboardConfig, setDashboardLive, setDashboardView, setSelectParentFrequency, setRecycleViewData } =
  dashboardSlice.actions;

export const dashboard = (state) => state.dashboard;

export default dashboardSlice.reducer;
