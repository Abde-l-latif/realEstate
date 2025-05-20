import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinloading: (state) => {
      state.loading = true;
    },
    signinsuccess: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    },
    signinfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    uploadSuccess: (state, action) => {
      state.userInfo = action.payload.rest;
      state.loading = false;
      state.error = null;
    },
    uploadLoading: (state) => {
      state.loading = true;
    },
    uploadfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    DeleteSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    },
    DeleteLoading: (state) => {
      state.loading = true;
    },
    Deletefailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutSuccess: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null;
    },
    signOutLoading: (state) => {
      state.loading = true;
    },
    signOutfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  signOutfailure,
  signOutLoading,
  signOutSuccess,
  DeleteSuccess,
  DeleteLoading,
  Deletefailure,
  signinfailure,
  signinsuccess,
  signinloading,
  uploadSuccess,
  uploadLoading,
  uploadfailure,
} = userSlice.actions;

export default userSlice.reducer;
