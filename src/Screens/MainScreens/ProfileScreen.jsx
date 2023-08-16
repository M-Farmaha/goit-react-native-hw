import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import AddIcon from "../../images/add-icon.svg";
import BG from "../../images/photo-bg.jpg";
import LogOutButton from "../../Components/LogOutButton";
import DefaultProfilePhoto from "../../images/default-profile-photo.jpg";

export default ProfileScreen = () => {
  const { nickName, photoURL } = useSelector((state) => state.auth);

  return (
    <View style={styles.wrap}>
      <Image source={BG} style={styles.bg} />

      <View style={styles.container}>
        <View style={styles.profileImage}>
          <View style={styles.profilePhotoWrap}>
            <Image
              source={photoURL ? {uri: photoURL} : DefaultProfilePhoto}
              style={styles.profilePhoto}
            />
          </View>
          <TouchableOpacity style={styles.removeBtn} activeOpacity={0.6}>
            <AddIcon width={13} height={13} fill={"#E8E8E8"} />
          </TouchableOpacity>
        </View>

        <LogOutButton
          style={{
            position: "absolute",
            top: 12,
            right: 6,
            padding: 10,
            backgroundColor: "transparent",
          }}
        />

        <Text style={styles.title}>{nickName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
  },

  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 150,
    backgroundColor: "#ffffff",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 92,
    paddingBottom: 78,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    marginBottom: 32,
  },
  profileImage: {
    position: "absolute",
    marginTop: -60, // Зсув контейнера вліво на половину його ширини
    top: 0,
    alignSelf: "center",
  },

  profilePhotoWrap: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    overflow: "hidden",
  },

  profilePhoto: {
    width: 120,
    height: 120,
  },

  removeBtn: {
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    right: -12,
    bottom: 14,
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
});
