import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import AddIcon from "../../assets/add-icon.svg";

export default function RegistrationForm() {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [isInputLoginFocused, setInputLoginFocused] = useState(false);
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

  const handleLoginFocus = () => {
    setInputLoginFocused(true);
  };
  const handleLoginBlur = () => {
    setInputLoginFocused(false);
  };

  const handleEmailFocus = () => {
    setInputEmailFocused(true);
  };
  const handleEmailBlur = () => {
    setInputEmailFocused(false);
  };

  const handlePasswordFocus = () => {
    setInputPasswordFocused(true);
  };
  const handlePasswordBlur = () => {
    setInputPasswordFocused(false);
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
      <View style={styles.form}>
        <View style={styles.profileImage}>
          <TouchableOpacity style={styles.addButton}>
            <AddIcon width={13} height={13} fill={"#FF6C00"} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Реєстрація</Text>
        <TextInput
          style={{
            ...styles.input,
            marginBottom: 16,
            borderColor: isInputLoginFocused ? "#FF6C00" : "#E8E8E8",
          }}
          placeholder={"Логін"}
          autoComplete={"off"}
          autoCorrect={false}
          selectionColor={"#FF6C00"}
          onFocus={handleLoginFocus}
          onBlur={handleLoginBlur}
        />
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
              marginBottom: isKeyboardShown ? 120 : 43,
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
        <View>
          <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
            <Text style={styles.btnText}>Зареєструватися</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnLink} activeOpacity={0.6}>
            <Text style={styles.btnLinkText}>Вже є акаунт? Увійти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 78,
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
