import {
  StyleSheet,
  Image,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useUser } from "../../../userContext";

import BG from "../../images/photo-bg.jpg";

export default LoginScreen = () => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [isInputEmailFocused, setInputEmailFocused] = useState(false);
  const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const { setIsLogined } = useUser();

  useEffect(() => {
    const showKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardShown(true);
      }
    );
    const hideKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardShown(false);
      }
    );

    return () => {
      showKB.remove();
      hideKB.remove();
    };
  }, []);

  const onLogin = () => {
    setEmail("");
    setPassword("");
    setIsLogined(true);
    Alert.alert("Виконано вхід зі сторінки Login");
  };

  return (
    <View style={styles.wrap}>
      <Image source={BG} style={styles.bg} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "heigth"}
          style={styles.container}
        >
          <View
            style={{
              ...styles.form,
              paddingBottom: isKeyboardShown ? 32 : 78,
            }}
          >
            <Text style={styles.title}>Увійти</Text>
            <TextInput
              style={[
                isInputEmailFocused
                  ? styles.focusedInput
                  : styles.unfocusedInput,
                { marginBottom: 16 },
              ]}
              placeholder={"Адреса електронної пошти"}
              autoComplete={"off"}
              autoCorrect={false}
              selectionColor={"#FF6C00"}
              value={email}
              onFocus={() => setInputEmailFocused(true)}
              onBlur={() => setInputEmailFocused(false)}
              onChangeText={(value) => setEmail(value)}
            />
            <View>
              <TextInput
                style={[
                  isInputPasswordFocused
                    ? styles.focusedInput
                    : styles.unfocusedInput,
                ]}
                placeholder={"Пароль"}
                secureTextEntry={!showPassword}
                autoComplete={"off"}
                autoCorrect={false}
                selectionColor={"#FF6C00"}
                value={password}
                onFocus={() => setInputPasswordFocused(true)}
                onBlur={() => setInputPasswordFocused(false)}
                onChangeText={(value) => setPassword(value)}
              />
              <TouchableOpacity
                style={{
                  ...styles.btnLink,
                  position: "absolute",
                  right: 16,
                  top: 13,
                }}
                activeOpacity={0.6}
                onPress={() => setShowPassword((prevState) => !prevState)}
              >
                <Text style={styles.btnLinkText}>
                  {showPassword ? "Приховати" : "Показати"}
                </Text>
              </TouchableOpacity>
            </View>
            {isKeyboardShown ? null : (
              <View>
                <TouchableOpacity
                  style={styles.btn}
                  activeOpacity={0.6}
                  onPress={onLogin}
                >
                  <Text style={styles.btnText}>Увійти</Text>
                </TouchableOpacity>
                <View style={styles.btnLinkWrap}>
                  <Text style={styles.btnLinkText}>Немає акаунту? </Text>
                  <TouchableOpacity
                    style={styles.btnLink}
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text
                      style={{
                        ...styles.btnLinkText,
                        textDecorationLine: "underline",
                      }}
                    >
                      Зареєструватися
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  form: {
    backgroundColor: "#ffffff",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 92,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  unfocusedInput: {
    fontSize: 16,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  focusedInput: {
    fontSize: 16,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: "#FF6C00",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    marginBottom: 32,
  },

  btn: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    height: 50,
    marginTop: 43,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#ffffff",
    fontSize: 16,
  },

  btnLinkText: {
    color: "#1B4371",
    fontSize: 16,
  },

  btnLinkWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
