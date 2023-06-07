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
} from "react-native";
import { useState, useEffect } from "react";

import AddPhotoIcon from "../../images/addphoto-icon.svg";
import LocationIcon from "../../images/location-icon.svg";

export default function CreatePostScreen() {
  const [postName, setPostName] = useState();
  const [location, setLocation] = useState();
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  useEffect(() => {
    const showKB = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardShown(true);
    });
    const hideKB = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardShown(false);
    });

    return () => {
      showKB.remove();
      hideKB.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
        <View style={styles.main}>
          <View style={styles.photo}>
            <TouchableOpacity style={styles.addPhoto} activeOpacity={0.6}>
              <AddPhotoIcon fill={"#bdbdbd"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Завантажте фото</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
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
            {!isKeyboardShown && (
              <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
                <Text style={styles.btnText}>Опублікувати</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: "#ffffff",

    paddingLeft: 16,
    paddingRight: 16,
  },

  photo: {
    marginTop: 32,
    width: "100%",
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
    marginBottom: 32,
  },

  form: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 16,
    backgroundColor: "#ffffff",
    paddingBottom: 80,
  },

  input: {
    fontSize: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  locationIcon: {
    position: "absolute",
    top: 14,
  },

  btn: {
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    height: 50,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#BDBDBD",
    fontSize: 16,
  },
});
