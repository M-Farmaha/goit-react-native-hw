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
  ActivityIndicator,
} from "react-native";

import React, { useState, useEffect, useRef } from "react";

import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";

import DeleteIcon from "../../images/delete-icon.svg";
import AddPhotoIcon from "../../images/addphoto-icon.svg";
import LocationIcon from "../../images/location-icon.svg";
import SyncIcon from "../../images/sync-icon.svg";
import { Dimensions } from "react-native";

export default CreatePostScreen = ({ navigation }) => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back);

  const [postName, setPostName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [photo, setPhoto] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const disabledPostBtn = !photo || !postName || !locationName || isLoading;
  const disabledDeleteBtn = (!photo && !postName && !locationName) || isLoading;

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
      let cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.granted);

      let libraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasLibraryPermission(libraryPermission.granted);

      let locationPermission =
        await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationPermission.granted);
    })();

    setIsCameraActive(true);

    return () => {
      setIsCameraActive(false);
    };
  }, []);

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePicture = async () => {
    const options = {
      quality: 1,
      base64: true,
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

      setPhoto(photo.uri);
      await MediaLibrary.createAssetAsync(photo.uri);
    }
  };

  const deletePicture = () => {
    setPhoto(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const clearPost = () => {
    setPhoto(null);
    setPostName("");
    setLocationName("");
  };

  const publishPost = async () => {
    setIsLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    navigation.navigate("DefaultScreen", {
      postName,
      locationName,
      photo,
      coords,
    });
    clearPost();
    setIsLoading(false);
  };

  if (hasCameraPermission === null) {
    return <Text>Requesting camera permition...</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>Permition for camera not granted</Text>;
  }

  if (hasLibraryPermission === null) {
    return <Text>Requesting library permition...</Text>;
  }
  if (hasLibraryPermission === false) {
    return <Text>Permition for library not granted</Text>;
  }

  if (hasLocationPermission === null) {
    return <Text>Requesting location permition...</Text>;
  }
  if (hasLocationPermission === false) {
    return <Text>Permission to access location not granted</Text>;
  }

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
              <View
                style={{
                  ...styles.cameraWrap,
                }}
              >
                {photo ? (
                  <View style={styles.photo}>
                    <Image
                      source={{ uri: photo }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </View>
                ) : isCameraActive ? (
                  <Camera
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").width * (4 / 3),
                    }}
                    type={type}
                    ref={setCameraRef}
                  ></Camera>
                ) : null}

                {photo ? (
                  <TouchableOpacity
                    style={styles.addPhoto}
                    activeOpacity={0.6}
                    onPress={deletePicture}
                    disabled={isLoading}
                  >
                    <DeleteIcon fill={"#ffffff"} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.addPhoto}
                    activeOpacity={0.6}
                    onPress={takePicture}
                    disabled={isLoading}
                  >
                    <AddPhotoIcon fill={"#ffffff"} />
                  </TouchableOpacity>
                )}

                {!photo && (
                  <TouchableOpacity
                    style={styles.toggleCameraType}
                    activeOpacity={0.6}
                    onPress={toggleCameraType}
                    disabled={isLoading}
                  >
                    <SyncIcon fill={"#ffffff"} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.pickImageBtn}
                activeOpacity={0.6}
                onPress={pickImage}
                disabled={isLoading}
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
                  value={locationName}
                  onChangeText={(value) => setLocationName(value)}
                />

                <LocationIcon style={styles.locationIcon} fill={"#bdbdbd"} />
              </View>

              {!isKeyboardShown && (
                <TouchableOpacity
                  disabled={disabledPostBtn}
                  activeOpacity={0.6}
                  style={{
                    ...styles.postBtn,
                    backgroundColor: disabledPostBtn ? "#f6f6f6" : "#FF6C00",
                  }}
                  onPress={publishPost}
                >
                  {isLoading ? (
                    <ActivityIndicator size={"large"} />
                  ) : (
                    <Text
                      style={{
                        ...styles.btnText,
                        color: disabledPostBtn ? "#bdbdbd" : "#ffffff",
                      }}
                    >
                      Опублікувати
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          {!isKeyboardShown && (
            <TouchableOpacity
              disabled={disabledDeleteBtn}
              activeOpacity={0.6}
              style={{
                ...styles.deleteBtn,
                backgroundColor: disabledDeleteBtn ? "#f6f6f6" : "#FF6C00",
              }}
              onPress={clearPost}
            >
              <View>
                <DeleteIcon fill={disabledDeleteBtn ? "#bdbdbd" : "#ffffff"} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

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

  cameraWrap: {
    marginHorizontal: 16,
    marginTop: 32,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    overflow: "hidden",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },

  toggleCameraType: {
    position: "absolute",
    bottom: 6,
    right: 6,
    padding: 10,
    backgroundColor: "#99ff7a",
  },

  photo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  addPhoto: {
    position: "absolute",
    borderRadius: 100,
    width: 60,
    height: 60,
    backgroundColor: "#00000040",
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

  postBtn: {
    borderRadius: 100,
    height: 50,
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    fontSize: 16,
  },

  deleteBtn: {
    width: 70,
    height: 40,

    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: "auto",
  },

  pickImageBtn: {
    marginLeft: 6,
    marginRight: "auto",
    marginBottom: 22,
    backgroundColor: "#99ff7a",
    padding: 10,
  },

  pickImageBtntext: {
    color: "#BDBDBD",
    fontSize: 16,
  },
});
