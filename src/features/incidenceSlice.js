import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ticketList: {},
};

const incidenceSlice = createSlice({
  name: "incidence",
  initialState,
  reducers: {
    setTicketList: (state, action) => {
      state.ticketList = action.payload.ticketList;
    },
    pushIncidenceComplexComposition: (state, action) => {
      const { key, hierarchy, complexDetails, complexComposition } =
        action.payload;
      state[key] = {
        complexDetails,
        complexComposition,
        hierarchy,
      };
    },
    removeIncidenceComplexComposition: (state, action) => {
      delete state[action.payload.key];
    },
    updateSelectedIncidenceComplex: (state, action) => {
      const { complex, hierarchy } = action.payload;
      state.complex = complex;
      state.hierarchy = hierarchy;
    },
    updateIncidenceSelectedCabin: (state, action) => {
      state.cabin = action.payload.cabin;
    },
  },
});

export const {
  setTicketList,
  pushIncidenceComplexComposition,
  removeIncidenceComplexComposition,
  updateSelectedIncidenceComplex,
  updateIncidenceSelectedCabin,
} = incidenceSlice.actions;

export const incidenceList = (state) => state.incidenece.ticketList;

export default incidenceSlice.reducer;
