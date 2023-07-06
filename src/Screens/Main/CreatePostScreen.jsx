import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, FlipType } from "expo-image-manipulator";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";

import React, { useState, useEffect, useRef } from "react";

import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

import DeleteIcon from "../../images/delete-icon.svg";
import AddPhotoIcon from "../../images/addphoto-icon.svg";
import LocationIcon from "../../images/location-icon.svg";
import SyncIcon from "../../images/sync-icon.svg";

export default function CreatePostScreen() {
  const [postName, setPostName] = useState();
  const [location, setLocation] = useState();
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const showKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardShown(true);
        if (Platform.OS == "ios")
          Keyboard.scheduleLayoutAnimation({
            duration: 500,
            easing: "keyboard",
          });
      }
    );
    const hideKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardShown(false);
        if (Platform.OS == "ios")
          Keyboard.scheduleLayoutAnimation({
            duration: 500,
            easing: "keyboard",
          });
      }
    );

    return () => {
      showKB.remove();
      hideKB.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermisson =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermisson.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permition...</Text>;
  }
  if (!hasCameraPermission) {
    return <Text>Permition for camera not granted...</Text>;
  }

  if (hasMediaLibraryPermission === undefined) {
    return <Text>Requesting permition...</Text>;
  }
  if (!hasMediaLibraryPermission) {
    return <Text>Permition for library not granted...</Text>;
  }

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePicture = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync(options);

      if (type === CameraType.front) {
        photo = await manipulateAsync(
          photo.localUri || photo.uri,
          [{ flip: FlipType.Horizontal }],
          { compress: 1 }
        );
      }

      await MediaLibrary.createAssetAsync(photo.uri);
      setPhoto(photo.uri);
    }
  };

  const deletePicture = () => {
    setPhoto(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View
          style={{
            ...styles.main,
            marginBottom: isKeyboardShown ? 122 : 34,
          }}
        >
          <View>
            <View>
              <Camera style={styles.camera} type={type} ref={setCameraRef}>
                {photo && (
                  <View style={styles.photo}>
                    <Image
                      source={{ uri: photo }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </View>
                )}

                {photo ? (
                  <TouchableOpacity
                    style={styles.addPhoto}
                    activeOpacity={0.6}
                    onPress={deletePicture}
                  >
                    <DeleteIcon fill={"#ffffff"} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.addPhoto}
                    activeOpacity={0.6}
                    onPress={takePicture}
                  >
                    <AddPhotoIcon fill={"#ffffff"} />
                  </TouchableOpacity>
                )}

                {!photo && (
                  <TouchableOpacity
                    style={styles.toggleCameraType}
                    activeOpacity={0.6}
                    onPress={toggleCameraType}
                  >
                    <SyncIcon fill={"#ffffff"} />
                  </TouchableOpacity>
                )}
              </Camera>
              <TouchableOpacity
                style={styles.pickImageBtn}
                activeOpacity={0.6}
                onPress={pickImage}
              >
                <Text style={styles.pickImageBtntext}>
                  {photo ? "Редагувати фото" : "Завантажте фото"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
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

              {!isKeyboardShown && (
                <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
                  <Text style={styles.btnText}>Опублікувати</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {!isKeyboardShown && (
            <TouchableOpacity activeOpacity={0.6} style={styles.deleteBtn}>
              <View>
                <DeleteIcon fill={"#bdbdbd"} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#ffffff",
  },

  main: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#ffffff",
  },

  camera: {
    marginHorizontal: 16,
    marginTop: 32,
    height: 240,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  toggleCameraType: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },

  photo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  addPhoto: {
    borderRadius: 100,
    width: 60,
    height: 60,
    backgroundColor: "#ffffff40",
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
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

  deleteBtn: {
    width: 70,
    height: 40,
    backgroundColor: "#f6f6f6",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: "auto",
  },

  pickImageBtn: {
    marginLeft: 16,
    marginRight: "auto",
    marginBottom: 32,
  },

  pickImageBtntext: {
    color: "#BDBDBD",
    fontSize: 16,
  },
});
