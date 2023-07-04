import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Image,
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
      const { uri } = await cameraRef.takePictureAsync(options);
      // await MediaLibrary.createAssetAsync(uri);
      setPhoto(uri);
    }
  };

  const deletePicture = () => {
    setPhoto(null);
  };

  return (
    <View
      style={{
        ...styles.main,
        justifyContent: isKeyboardShown ? "flex-end" : "flex-start",
      }}
    >
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
        <Text style={styles.text}>Завантажте фото</Text>
      </View>

      <View
        style={{
          flex: isKeyboardShown ? 0 : 1,
          justifyContent: "space-between",
          marginBottom: 34,
        }}
      >
        <View
          style={{
            ...styles.form,
            marginBottom: isKeyboardShown ? 0 : 0,
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

          {!isKeyboardShown && (
            <TouchableOpacity style={styles.btn} activeOpacity={0.6}>
              <Text style={styles.btnText}>Опублікувати</Text>
            </TouchableOpacity>
          )}
        </View>
        {!isKeyboardShown && (
          <TouchableOpacity activeOpacity={0.6} style={styles.deleteBtn}>
            <View>
              <DeleteIcon fill={"#bdbdbd"} />
            </View>
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

  text: {
    color: "#BDBDBD",
    fontSize: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
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
  },
});
