// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getEmptyUser = () => {
  return {}; // Placeholder, replace with the actual logic
};

const initialState = {
  username: null,
  credentials: null,
  authenticated: false,
  user: getEmptyUser(),
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
      console.log("22-->", userDetails);
      // Update state based on userDetails
      state.credentials = userDetails;
      state.authenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      console.log("User set in Redux:", action.payload);
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

export default authSlice.reducer;
