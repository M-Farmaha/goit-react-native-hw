import {
  StyleSheet,
  TextInput,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import BG from "../assets/photo-bg.jpg";

export default function RegistrationScreen() {
  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      {/* <KeyboardAvoidingView // визначаємо ОС та налаштовуємо поведінку клавіатури
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      > */}
      <View style={styles.form}>
        <View style={styles.profileImage}></View>
        <Text style={styles.title}>Реєстрація</Text>
        <TextInput style={styles.input} placeholder={"Логін"} />
        <TextInput
          style={styles.input}
          placeholder={"Адреса електронної пошти"}
        />
        <TextInput
          style={styles.input}
          placeholder={"Пароль"}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
          <Text style={styles.btnText}>Зареєструватися</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLink} activeOpacity={0.6}>
          <Text style={styles.btnLinkText}>Вже є акаунт? Увійти</Text>
        </TouchableOpacity>
      </View>
      {/* </KeyboardAvoidingView> */}
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
    justifyContent: "center",
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
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    marginBottom: 16,
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
