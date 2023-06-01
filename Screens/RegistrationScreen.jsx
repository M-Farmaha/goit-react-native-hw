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

export default function RegistrationScreen() {
  const [isInputLoginFocused, setInputLoginFocused] = useState(false);
  const [isInputEmailFocused, setInputEmailFocused] = useState(false);
  const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);
  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
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
            borderColor: isInputLoginFocused ? "#FF6C00" : "#E8E8E8",
          }}
          placeholder={"Логін"}
          selectionColor={"#FF6C00"}
          onFocus={() => setInputLoginFocused(true)}
          onBlur={() => setInputLoginFocused(false)}
        />
        <TextInput
          style={{
            ...styles.input,
            borderColor: isInputEmailFocused ? "#FF6C00" : "#E8E8E8",
          }}
          placeholder={"Адреса електронної пошти"}
          selectionColor={"#FF6C00"}
          onFocus={() => setInputEmailFocused(true)}
          onBlur={() => setInputEmailFocused(false)}
        />
        <View style={styles.password}>
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
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  password: {
    position: "relative",
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
