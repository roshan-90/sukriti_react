import { createSlice, createAction } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  status: 0,
  complexes: Array(10).fill({
    isEmpty: true,
    water: "",
    mwc: {},
    fwc: {},
    pwc: {},
    uri: {},
  }),
};

// Create a slice using createSlice
const icccDataSlice = createSlice({
  name: "iccc_data",
  initialState,
  reducers: {
    savePayload: (state, action) => {
      const { data, index } = action.payload;

      const updateComplex = {
        isEmpty: false,
        water: data.Freshwaterlevel,
      };

      if (data.THING_NAME.includes("MWC")) {
        updateComplex.mwc = data;
      } else if (data.THING_NAME.includes("FWC")) {
        updateComplex.fwc = data;
      } else if (data.THING_NAME.includes("PWC")) {
        updateComplex.pwc = data;
      } else if (data.THING_NAME.includes("MUR")) {
        updateComplex.uri = data;
      }

      state.complexes[index] = {
        ...state.complexes[index],
        ...updateComplex,
      };
    },
  },
});

// Export the reducer and actions
export const { savePayload } = icccDataSlice.actions;
export default icccDataSlice.reducer;

// Create an action using createAction
export const SAVE_PAYLOAD = "iccc:save-payload";
export const savePayloadAction = createAction(
  SAVE_PAYLOAD,
  (payload, topic) => {
    let index = 0;
    if (payload.COMPLEX === undefined) {
      console.log("payload-topic", topic.split("/"));
      payload.COMPLEX = topic.split("/")[5];
    }

    console.log("payload", payload.COMPLEX);

    switch (payload.COMPLEX) {
      case "AIRTEL_CITYCENTRE":
        index = 0;
        break;
      case "KRH_GSCDL":
        index = 1;
        break;
      case "GSCDCL_H_COURT":
        index = 2;
        break;
      case "COLLECTORATE_GSCDCL":
        index = 3;
        break;
      case "KRG_GSCDCL":
        index = 4;
        break;
      case "DD_NAGAR_GSCDCL":
        index = 5;
        break;
      case "CIRCUIT_HOUSE_GSCDCL":
        index = 6;
        break;
      default:
        index = 0;
    }
    console.log("payload", index);
    return { payload: { data: payload, index: index } };
  }
);
