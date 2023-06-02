import { StyleSheet, Image, View } from "react-native";

import BG from "../assets/photo-bg.jpg";
import RegistrationForm from "./Components/RegistrationForm";

export default function RegistrationScreen() {
  return (
    <View style={styles.wrap}>
      <Image source={BG} style={styles.bg} />
      <RegistrationForm />
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
