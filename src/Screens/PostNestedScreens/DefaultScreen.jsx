import { StyleSheet, Text, View, Image } from "react-native";

import ProfilePhoto from "../../images/profile-photo.jpg";

export default function DefaultScreen() {
  return (
    <View style={styles.main}>
      <View style={styles.profile}>
        <View style={styles.profileImage}>
          <Image source={ProfilePhoto} style={styles.profilePhoto} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Maks Farmaha</Text>
          <Text style={styles.profileEmail}>maks.farmaha@gmail.com</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#ffffff",

    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    paddingBottom: 32,
  },

  profile: {
    marginBottom: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    overflow: "hidden",
  },
  profilePhoto: {
    width: 60,
    height: 60,
  },

  profileName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
  },
  profileEmail: {
    fontSize: 11,
  },
});
