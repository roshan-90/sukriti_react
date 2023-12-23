import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasData: false,
  data: {},
  configData: {},
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
  },
});

export const { setDashboardData, setDashboardConfig, setDashboardLive } =
  dashboardSlice.actions;

export const dashboard = (state) => state.dashboard;

export default dashboardSlice.reducer;
