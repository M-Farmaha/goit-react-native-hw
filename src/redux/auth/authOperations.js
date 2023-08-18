import { Alert } from "react-native";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../firebase/config.js";

import {
  updateUserProfile,
  authStateChange,
  authSignOut,
  isLoadingChange,
} from "./authReducer.js";

export const saveProfilePhotoToFirebaseStorage = async (profilePhoto, userId) => {
  try {
    if (!profilePhoto) {
      return null;
    }
    const response = await fetch(profilePhoto);
    const file = await response.blob();
    const storageRef = ref(storage, `profilePhotos/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch {
    Alert.alert("Помилка збереження фото профілю до сховища бази даних");
  }
};

export const authSingUpUser =
  ({ login, email, password, profilePhoto }) =>
  async (dispatch, getState) => {
    dispatch(isLoadingChange(true));

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      if (user) {
        const downloadUrl = await saveProfilePhotoToFirebaseStorage(
          profilePhoto,
          user.uid
        );

        await updateProfile(user, {
          displayName: login,
          photoURL: downloadUrl,
        });

        dispatch(
          updateUserProfile({
            userId: user.uid,
            nickName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
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
        Alert.alert("Помилка реєстрації");
      }
    }

    dispatch(isLoadingChange(false));
  };

export const authSingInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {

    dispatch(isLoadingChange(true));

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
        Alert.alert("Помилка авторизації");
      }
    }

    dispatch(isLoadingChange(false));
  };

export const authSingOutUser = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authSignOut());
  } catch {
    Alert.alert("Помилка виходу");
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
          email: user.email,
          photoURL: user.photoURL,
        })
      );
    }
  });
};
