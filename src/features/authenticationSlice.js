// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  credentials: null,
  authenticated: false,
  user: null,
  accessTree: undefined,
  loadingPdf: false,
  triggerFunction: false,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
      localStorage.setItem("user", action.payload);
    },
    setLoggedIn: (state, action) => {
      const userDetails = action.payload;
      state.credentials = userDetails;
      state.authenticated = true;
    },
    setUser: (state, action) => {
      console.log("User set in Redux:", action.payload);
      state.user = action.payload;
    },
    setAccessTree: (state, action) => {
      state.accessTree = action.payload;
    },
    setLoadingPdf: (state, action) => {
      state.loadingPdf  = action.payload;
    },
    setTriggerFunction: (state, action) => {
      state.triggerFunction = action.payload;
    },
    clearUser: (state) => {
      state.username = null;
      state.credentials = null;
      state.authenticated = false;
      state.loadingPdf = false;
      state.triggerFunction = false
      // localStorage.clear();
    },
  },
});

export const { setUser, clearUser, setUsername, setLoggedIn, setAccessTree, setLoadingPdf, setTriggerFunction } =
  authSlice.actions;
export const selectUser = (state) => state.authentication;
export const selectIsAuthenticated = (state) =>
  state.authentication.authenticated;
export const authState = (state) => state.authentication;

export default authSlice.reducer;
