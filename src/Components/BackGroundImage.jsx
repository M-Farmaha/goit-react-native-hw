import React from "react";
import { StyleSheet, Image } from "react-native";

const BG = require("../images/photo-bg.jpg");

export default BackgroundImage = () => (
  <Image source={BG} style={styles.backGroundImage} />
);

const styles = StyleSheet.create({
  backGroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
});
