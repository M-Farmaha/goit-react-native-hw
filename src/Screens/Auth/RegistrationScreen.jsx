import {
  StyleSheet,
  TextInput,
  Image,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useUser } from "../../../userContext";

import AddIcon from "../../images/add-icon.svg";
import BG from "../../images/photo-bg.jpg";

export default RegistrationScreen = () => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [isInputLoginFocused, setInputLoginFocused] = useState(false);
  const [isInputEmailFocused, setInputEmailFocused] = useState(false);
  const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const { setIsLogined } = useUser();

  useEffect(() => {
    const showKB = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardShown(true);
    });
    const hideKB = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardShown(false);
    });

    return () => {
      showKB.remove();
      hideKB.remove();
    };
  }, []);

  const onLogin = () => {
    setLogin("");
    setEmail("");
    setPassword("");
    setIsLogined(true);
  };
  return (
    <View style={styles.wrap}>
      <Image source={BG} style={styles.bg} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
          <View
            style={{
              ...styles.form,
              paddingBottom: isKeyboardShown ? 278 : 78,
            }}
          >
            <View style={styles.profileImage}>
              <TouchableOpacity style={styles.addButton} activeOpacity={0.6}>
                <AddIcon width={13} height={13} fill={"#FF6C00"} />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Реєстрація</Text>
            <TextInput
              style={[
                isInputLoginFocused
                  ? styles.focusedInput
                  : styles.unfocusedInput,
                { marginBottom: 16 },
              ]}
              placeholder={"Логін"}
              autoComplete={"off"}
              autoCorrect={false}
              selectionColor={"#FF6C00"}
              value={login}
              onFocus={() => setInputLoginFocused(true)}
              onBlur={() => setInputLoginFocused(false)}
              onChangeText={(value) => setLogin(value)}
            />
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
            {!isKeyboardShown && (
              <View>
                <TouchableOpacity
                  style={styles.btn}
                  activeOpacity={0.6}
                  onPress={onLogin}
                >
                  <Text style={styles.btnText}>Зареєструватися</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnLink}
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.btnLinkText}>Вже є акаунт? Увійти</Text>
                </TouchableOpacity>
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
  },
  form: {
    width: "100%",
    position: "absolute",
    bottom: 0,
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
  profileImage: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    zIndex: 2,
    marginTop: -60, // Зсув контейнера вліво на половину його ширини
    top: 0,
    alignSelf: "center",
  },

  addButton: {
    position: "absolute",
    right: -12,
    bottom: 14,
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
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
  btnLink: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  btnLinkText: {
    color: "#1B4371",
    fontSize: 16,
  },
});
