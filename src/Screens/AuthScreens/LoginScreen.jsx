import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authSingInUser } from "../../redux/auth/authOperations";
import { getIsLoading } from "../../redux/auth/selectors";

export default LoginScreen = ({ isKeyboardShown, setisRegistrationScreen }) => {
  const [isInputEmailFocused, setInputEmailFocused] = useState(false);
  const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  
  const isLoading = useSelector(getIsLoading);
  const disabledLoginBtn = isLoading;

  const handleLogin = () => {
    if (email.length === 0) {
      Alert.alert("Адреса електронної пошти не може бути пустою");
      return;
    }
    if (password.length === 0) {
      Alert.alert("Пароль не може бути пустим");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Пароль повинен містити щонайменше 6 символів");
      return;
    }

    dispatch(authSingInUser({ email, password }));
  };

  return (
    <>
      <View style={styles.main}>
        <Text style={styles.title}>Увійти</Text>
        <View style={styles.form}>
          <TextInput
            style={{
              ...styles.input,
              marginBottom: 16,
              backgroundColor: isInputEmailFocused ? "#ffffff" : "#F6F6F6",
              borderColor: isInputEmailFocused ? "#3470FF" : "#E8E8E8",
            }}
            placeholder={"Адреса електронної пошти"}
            autoComplete={"off"}
            autoCorrect={false}
            selectionColor={"#3470FF"}
            value={email}
            onFocus={() => setInputEmailFocused(true)}
            onBlur={() => setInputEmailFocused(false)}
            onChangeText={(value) => setEmail(value)}
          />
          <View>
            <TextInput
              style={{
                ...styles.input,
                marginBottom: 34,
                backgroundColor: isInputPasswordFocused ? "#ffffff" : "#F6F6F6",
                borderColor: isInputPasswordFocused ? "#3470FF" : "#E8E8E8",
              }}
              placeholder={"Пароль"}
              secureTextEntry={!showPassword}
              autoComplete={"off"}
              autoCorrect={false}
              selectionColor={"#3470FF"}
              value={password}
              onFocus={() => setInputPasswordFocused(true)}
              onBlur={() => setInputPasswordFocused(false)}
              onChangeText={(value) => setPassword(value)}
            />
            <TouchableOpacity
              style={{
                ...styles.btnLink,
                position: "absolute",
                right: 6,
                top: 4,
                padding: 10,
                backgroundColor: "transparent",
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
                disabled={disabledLoginBtn}
                activeOpacity={0.6}
                style={{
                  ...styles.btn,
                  backgroundColor: disabledLoginBtn ? "#f6f6f6" : "#3470FF",
                }}
                onPress={handleLogin}
              >
                {isLoading ? (
                  <ActivityIndicator size={"large"} />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: disabledLoginBtn ? "#bdbdbd" : "#ffffff",
                    }}
                  >
                    Увійти
                  </Text>
                )}
              </TouchableOpacity>
              <View style={styles.btnLinkWrap}>
                <Text style={styles.btnLinkText}>Немає акаунту? </Text>
                <TouchableOpacity
                  style={styles.btnLink}
                  activeOpacity={0.6}
                  onPress={() => setisRegistrationScreen(true)}
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  main: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  form: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
  },

  input: {
    fontSize: 16,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    marginTop: 32,
    marginBottom: 32,
  },

  btn: {
    backgroundColor: "#3470FF",
    borderRadius: 100,
    height: 50,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },


  btnLinkText: {
    color: "#1B4371",
    fontSize: 16,
  },

  btnLinkWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 144,
  },
});
