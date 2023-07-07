import {
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import { useState, useEffect } from "react";

import BackGroundImage from "../../Components/BackGroundImage";

import RegistrationScreen from "./RegistrationScreen";
import LoginScreen from "./LoginScreen";

export default AuthScreen = () => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [isRegisttationScreen, setIsRegisttationScreen] = useState(false);

  useEffect(() => {
    const showKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardShown(true);
        if (Platform.OS == "ios")
          Keyboard.scheduleLayoutAnimation({
            duration: 500,
            easing: "keyboard",
          });
      }
    );
    const hideKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardShown(false);
        if (Platform.OS == "ios")
          Keyboard.scheduleLayoutAnimation({
            duration: 500,
            easing: "keyboard",
          });
      }
    );

    return () => {
      showKB.remove();
      hideKB.remove();
    };
  }, []);

  return (
    <>
      <BackGroundImage />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : null}
          style={styles.container}
        >
          {isRegisttationScreen ? (
            <RegistrationScreen
              isKeyboardShown={isKeyboardShown}
              setIsRegisttationScreen={setIsRegisttationScreen}
            />
          ) : (
            <LoginScreen
              isKeyboardShown={isKeyboardShown}
              setIsRegisttationScreen={setIsRegisttationScreen}
            />
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
