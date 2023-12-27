// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const complexStoreSlice = createSlice({
  name: "complexStore",
  initialState: initialState,
  reducers: {
    setPushComplexPosition: (state, action) => {
      var complexComposition = {
        complexDetails: action.payload.complexDetails,
        complexComposition: action.payload.complexComposition,
        hierarchy: action.payload.hierarchy,
      };
      const key = action.payload.complexDetails.name;
      state[key] = complexComposition;
    },
    removeComplexComposition: (state, action) => {
      delete state[action.payload.key];
    },
    updateSelectedComplex: (state, action) => {
      const { complex, hierarchy } = action.payload;
      state.complex = complex;
      state.hierarchy = hierarchy;
    },
    updateSelectedCabin: (state, action) => {
      state.cabin = action.payload.cabin;
    },
    savePayload: (state, action) => {
      state.cabinPayload = action.payload.cabinPayload;
    },
    updatedSavePayload: (state, action) => {
      state.updatedCabinPayload = action.payload.updatedCabinPayload;
    },
  },
});

export const {
  setPushComplexPosition,
  removeComplexComposition,
  updateSelectedComplex,
  updateSelectedCabin,
  savePayload,
  updatedSavePayload,
} = complexStoreSlice.actions;

export const complexStore = (state) => state.complexStore;

export default complexStoreSlice.reducer;
