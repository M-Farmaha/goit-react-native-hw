import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  nickName: null,
  email: null,
  photoURL: null,
  stateChange: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      nickName: payload.nickName,
      email: payload.email,
      photoURL: payload.photoURL,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload,
    }),
    isLoadingChange: (state, { payload }) => ({
      ...state,
      isLoading: payload,
    }),
    authSignOut: () => ({ ...initialState }),
  },
});

export const {
  updateUserProfile,
  authStateChange,
  authSignOut,
  isLoadingChange,
} = authSlice.actions;
