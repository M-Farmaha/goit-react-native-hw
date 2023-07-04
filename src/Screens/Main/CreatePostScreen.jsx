import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";

import AddPhotoIcon from "../../images/addphoto-icon.svg";
import LocationIcon from "../../images/location-icon.svg";

export default function CreatePostScreen() {
  const [postName, setPostName] = useState();
  const [location, setLocation] = useState();
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  useEffect(() => {
    const showKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardShown(true);
      }
    );
    const hideKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardShown(false);
      }
    );

    return () => {
      showKB.remove();
      hideKB.remove();
    };
  }, []);

  return (
    <View
      style={{
        ...styles.main,
        justifyContent: isKeyboardShown ? "flex-end" : "flex-start",
      }}
    >
      <View>
        <View style={styles.photo}>
          <TouchableOpacity style={styles.addPhoto} activeOpacity={0.6}>
            <AddPhotoIcon fill={"#bdbdbd"} />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Завантажте фото</Text>
      </View>

      <View
        style={{
          ...styles.form,
          marginBottom: isKeyboardShown ? 32 : 0,
        }}
      >
        <TextInput
          style={{
            ...styles.input,
            marginBottom: 16,
          }}
          placeholder={"Назва..."}
          autoComplete={"off"}
          autoCorrect={false}
          selectionColor={"#bdbdbd"}
          value={postName}
          onChangeText={(value) => setPostName(value)}
        />
        <View>
          <TextInput
            style={{
              ...styles.input,
              paddingLeft: 25,
            }}
            placeholder={"Місцевість..."}
            autoComplete={"off"}
            autoCorrect={false}
            selectionColor={"#bdbdbd"}
            value={location}
            onChangeText={(value) => setLocation(value)}
          />

          <LocationIcon style={styles.locationIcon} fill={"#bdbdbd"} />
        </View>

        {isKeyboardShown ? null : (
          <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
            <Text style={styles.btnText}>Опублікувати</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  photo: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 32,
    height: 240,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    borderColor: "#e8e8e8",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  addPhoto: {
    borderRadius: 100,
    width: 60,
    height: 60,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#bdbdbd",
    fontSize: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
  },

  form: {
    backgroundColor: "#ffffff",
    marginLeft: 16,
    marginRight: 16,
  },

  input: {
    fontSize: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },

  locationIcon: {
    position: "absolute",
    top: 14,
  },

  btn: {
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    height: 50,
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#BDBDBD",
    fontSize: 16,
  },
});
