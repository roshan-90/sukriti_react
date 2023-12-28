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
      state.hasData = true;
      state.data = action.payload.reportData;
    },
    setReportReset: (state) => {
      state.hasData = false;
      state.data = {};
    },
  },
});

export const { setReportData, setReportReset } = reportSlice.actions;
export default reportSlice.reducer;
