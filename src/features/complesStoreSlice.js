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
      console.log("state --> updateSelectedComplex-->", action.payload);
      // Create a new state object
      return {
        ...state,
        complex: complex,
        hierarchy: hierarchy,
      };
    },
    updateSelectedCabin: (state, action) => {
      const cabin = action.payload.cabin;
      return {
        ...state,
        cabin: cabin,
      };
    },
    savePayload: (state, action) => {
      const cabinPayload = action.payload.cabinPayload;
      return {
        ...state,
        cabinPayload: cabinPayload,
      };
    },
    updatedSavePayload: (state, action) => {
      const updatedCabinPayload = action.payload.updatedCabinPayload;
      return {
        ...state,
        updatedCabinPayload: updatedCabinPayload,
      };
    },
    emptyComplexStore: (state, action) => {
      return (state = initialState);
    },
    fullComplexStore: (state, action) => {
      return (state = action.payload);
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
  emptyComplexStore,
  fullComplexStore,
} = complexStoreSlice.actions;

export const complexStore = (state) => state.complexStore;

export default complexStoreSlice.reducer;
