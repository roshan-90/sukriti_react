import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasData: false,
  data: [],
};

const extraSlice = createSlice({
  name: "extra",
  initialState,
  reducers: {
    setComplexData: (state, action) => {
      state.hasData = true;
      state.data.push(action.payload.complexData);
    },
    setResetData: (state) => {
      state.hasData = false;
      state.data = [];
    },
  },
});

export const { setComplexData, setResetData } = extraSlice.actions;

export const extraData = (state) => state.extra.data
export default extraSlice.reducer;
