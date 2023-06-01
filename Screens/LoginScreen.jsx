import {
  StyleSheet,
  TextInput,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

import BG from "../assets/photo-bg.jpg";
import AddIcon from "../assets/add-icon.svg";

export default function LoginScreen() {
  const [isInputEmailFocused, setInputEmailFocused] = useState(false);
  const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);
  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <View style={styles.form}>
        <Text style={styles.title}>Увійти</Text>
        <TextInput
          style={{
            ...styles.input,
            marginBottom: 16,
            borderColor: isInputEmailFocused ? "#FF6C00" : "#E8E8E8",
          }}
          placeholder={"Адреса електронної пошти"}
          selectionColor={"#FF6C00"}
          onFocus={() => setInputEmailFocused(true)}
          onBlur={() => setInputEmailFocused(false)}
        />
        <View>
          <TextInput
            style={{
              ...styles.input,
              borderColor: isInputPasswordFocused ? "#FF6C00" : "#E8E8E8",
            }}
            placeholder={"Пароль"}
            secureTextEntry={true}
            selectionColor={"#FF6C00"}
            onFocus={() => setInputPasswordFocused(true)}
            onBlur={() => setInputPasswordFocused(false)}
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
        <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
          <Text style={styles.btnText}>Зареєструватися</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLink} activeOpacity={0.6}>
          <Text style={styles.btnLinkText}>Вже є акаунт? Увійти</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    position: "relative",
    backgroundColor: "#ffffff",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    paddingBottom: 144,
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
  btnLink: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  btnLinkText: {
    color: "#1B4371",
    fontSize: 16,
  },
});
