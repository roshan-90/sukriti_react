import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendorList: [],
  teamList: [],
  data: [],
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setTeamList: (state, action) => {
      state.teamList = action.payload.teamList;
    },
    setVendorList: (state, action) => {
      state.vendorList = action.payload.vendorList;
    },
    // Uncomment the code below if you want to include the ACTION_ADD_MEMBER case
    // addMember: (state, action) => {
    //   state.teamList.push(action.payload.user);
    // },
  },
});

export const { setTeamList, setVendorList, addMember } = vendorSlice.actions;
export default vendorSlice.reducer;
