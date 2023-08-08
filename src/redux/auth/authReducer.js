import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  nickName: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      nickName: payload.nickName,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload,
    }),
    authSignOut: () => ({ state: initialState }),
  },
});

export const { updateUserProfile, authStateChange, authSignOut } =
  authSlice.actions;
