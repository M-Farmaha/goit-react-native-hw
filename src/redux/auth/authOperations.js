import { Alert } from "react-native";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase/config.js";

import {
  updateUserProfile,
  authStateChange,
  authSignOut,
} from "./authReducer.js";

export const authSingUpUser =
  ({ login, email, password }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: login });
        dispatch(
          updateUserProfile({ userId: user.uid, nickName: user.displayName })
        );
      }
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        Alert.alert("Неправильна адреса електронної пошти");
      } else if (error.code === "auth/missing-password") {
        Alert.alert("Пароль не може бути пустим");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Пароль повинен містити щонайменше 6 символів");
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert("Така пошта вже зареєстрована");
      } else {
        Alert.alert(error.code);
      }
    }
  };

export const authSingInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert("Неправильна адреса електронної пошти або пароль");
      } else if (error.code === "auth/missing-password") {
        Alert.alert("Пароль не може бути пустим");
      } else {
        Alert.alert(error.code);
      }
    }
  };

export const authSingOutUser = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(authStateChange(true));
      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickName: user.displayName,
        })
      );
    }
  });
};
