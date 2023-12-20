// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  credentials: null,
  authenticated: false,
  user: null,
  accessTree: undefined,
};

const authSlice = createSlice({
  name: "auth",
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
    clearUser: (state) => {
      state.username = null;
      state.credentials = null;
      state.authenticated = false;
      localStorage.clear();
    },
  },
});

export const { setUser, clearUser, setUsername, setLoggedIn } =
  authSlice.actions;
export const selectUser = (state) => state.auth.username;
export const selectIsAuthenticated = (state) => state.auth.authenticated;
export const authState = (state) => state.auth;

export default authSlice.reducer;
