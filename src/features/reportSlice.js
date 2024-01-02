import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasData: false,
  data: {},
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportData: (state, action) => {
      console.log("setReportData slice -->", action.payload);
      state.hasData = true;
      state.data = action.payload;
    },
    setReportReset: (state) => {
      state.hasData = false;
      state.data = {};
    },
  },
});

export const { setReportData, setReportReset } = reportSlice.actions;
export const hasData = (state) => state.report.hasData;
export default reportSlice.reducer;
