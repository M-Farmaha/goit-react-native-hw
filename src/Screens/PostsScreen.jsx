import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import LogOutIcon from "../images/log-out-icon.svg";
import GridIcon from "../images/grid-icon.svg";
import UserIcon from "../images/user-icon.svg";
import AddIcon from "../images/add-icon.svg";
import ProfilePhoto from "../images/profile-photo.jpg";

export default function PostScreen() {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Публікації</Text>

        <TouchableOpacity style={styles.logOutButton}>
          <LogOutIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View style={styles.profile}>
          <View style={styles.profileImage}>
            <Image source={ProfilePhoto} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Maks Farmaha</Text>
            <Text style={styles.profileEmail}>maks.farmaha@gmail.com</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <GridIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAddButton}>
          <AddIcon width={13} height={13} fill={"#ffffff"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <UserIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 88,
    backgroundColor: "#ffffff",
  },
  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 17,
    marginTop: 55,
  },
  logOutButton: {
    position: "absolute",
    right: 16,
    bottom: 10,
    width: 24,
    height: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopWidth: 0.6,
    borderBottomWidth: 0.6,
    borderColor: "#B3B3B3",
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
  profileName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
  },
  profileEmail: {
    fontSize: 11,
  },

  footer: {
    padding: 9,
    justifyContent: "center",
    flexDirection: "row",
    gap: 31,
    height: 83,
    backgroundColor: "#ffffff",
  },
  footerButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  footerAddButton: {
    width: 70,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
  },
});
