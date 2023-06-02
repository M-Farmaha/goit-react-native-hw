import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";

export default function LoginForm() {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [isInputEmailFocused, setInputEmailFocused] = useState(false);
  const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);

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

  const handleEmailFocus = () => {
    setInputEmailFocused(true);
    setIsKeyboardShown(true);
  };
  const handleEmailBlur = () => {
    setInputEmailFocused(false);
  };

  const handlePasswordFocus = () => {
    setInputPasswordFocused(true);
    setIsKeyboardShown(true);
  };
  const handlePasswordBlur = () => {
    setInputPasswordFocused(false);
  };

  return (
    <View
      style={{
        ...styles.form,
        paddingBottom: isKeyboardShown ? 32 : 150,
      }}
    >
      <Text style={styles.title}>Увійти</Text>
      <TextInput
        style={{
          ...styles.input,
          marginBottom: 16,
          borderColor: isInputEmailFocused ? "#FF6C00" : "#E8E8E8",
        }}
        placeholder={"Адреса електронної пошти"}
        autoComplete={"off"}
        autoCorrect={false}
        selectionColor={"#FF6C00"}
        onFocus={handleEmailFocus}
        onBlur={handleEmailBlur}
      />
      <View>
        <TextInput
          style={{
            ...styles.input,
            borderColor: isInputPasswordFocused ? "#FF6C00" : "#E8E8E8",
          }}
          placeholder={"Пароль"}
          secureTextEntry={true}
          autoComplete={"off"}
          autoCorrect={false}
          selectionColor={"#FF6C00"}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
        />
        <TouchableOpacity
          style={{
            ...styles.btnLink,
            position: "absolute",
            right: 16,
            top: 13,
          }}
          activeOpacity={0.6}
        >
          <Text style={styles.btnLinkText}>Показати</Text>
        </TouchableOpacity>
      </View>
      {!isKeyboardShown && (
        <View>
          <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
            <Text style={styles.btnText}>Увійти</Text>
          </TouchableOpacity>
          <View style={styles.btnLinkWrap}>
            <Text style={styles.btnLinkText}>Немає акаунту? </Text>
            <TouchableOpacity style={styles.btnLink} activeOpacity={0.6}>
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
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#ffffff",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  input: {
    fontSize: 16,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontWeight: 500,
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
