import { manipulateAsync, FlipType } from "expo-image-manipulator";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import axios from "axios";

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
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/config.js";

import DeleteIcon from "../../images/delete-icon.svg";
import AddPhotoIcon from "../../images/addphoto-icon.svg";
import LocationIcon from "../../images/location-icon.svg";
import SyncIcon from "../../images/sync-icon.svg";
import { useNavigation } from "@react-navigation/native";

export default CreatePostScreen = () => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back);

  const [postName, setPostName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const { nickName, userId } = useSelector((state) => state.auth);

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

  const getPlaceInfoByCoordinates = async () => {
    try {
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

      const response = await axios.get(apiUrl);
      const { address } = response.data;

      setCoords({
        latitude: location ? latitude : null,
        longitude: location ? longitude : null,
        city: address ? address.city : null,
        country: address ? address.country : null,
      });

      if (address.city && address.country) {
        setLocationName(`${address.city}, ${address.country}`);
      } else {
        Alert.alert("Локація не визначена");
      }
    } catch {
      Alert.alert(`Помилка визначення локації`);
    }
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

      await getPlaceInfoByCoordinates();

      await MediaLibrary.createAssetAsync(photo.uri);
    }
  };

  const savePhotoToFirebaseStorage = async () => {
    try {
      const response = await fetch(photo);
      const file = await response.blob();
      const storageRef = ref(storage, `postsPhotos/${file._data.blobId}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch {
      Alert.alert(`Помилка збереження фото до сховища бази даних`);
    }
  };

  const writeDataToFirestore = async (data) => {
    try {
      await addDoc(collection(db, "posts"), data);
    } catch {
      Alert.alert(`Помилка запису до бази даних`);
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

    try {
      const downloadUrl = await savePhotoToFirebaseStorage();

      await writeDataToFirestore({
        coords,
        postName,
        locationName,
        photo: downloadUrl,
        nickName,
        userId,
        date: Date.now(),
        likesCount: 0,
        likedBy: [],
        commentsCount: 0,
      });

      navigation.goBack();

      clearPost();
    } catch {
      Alert.alert(`Помилка публікації посту`);
    }

    setIsLoading(false);
  };

  if (hasCameraPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Requesting camera permition...</Text>
      </View>
    );
  }
  if (hasCameraPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Permition for camera not granted</Text>
      </View>
    );
  }

  if (hasLibraryPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Requesting library permition...</Text>
      </View>
    );
  }
  if (hasLibraryPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Permition for library not granted</Text>
      </View>
    );
  }

  if (hasLocationPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Requesting location permition...</Text>
      </View>
    );
  }
  if (hasLocationPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Permission to access location not granted</Text>
      </View>
    );
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
                        fontSize: 16,
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
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
    padding: 10,
  },

  pickImageBtntext: {
    color: "#BDBDBD",
    fontSize: 16,
  },
});
