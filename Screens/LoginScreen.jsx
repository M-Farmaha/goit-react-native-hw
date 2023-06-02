import { StyleSheet, Image, View } from "react-native";

import BG from "../assets/photo-bg.jpg";
import LoginForm from "./Components/LoginForm";

export default function LoginScreen() {
  return (
    <View style={styles.wrap}>
      <Image source={BG} style={styles.bg} />
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },

  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
});
