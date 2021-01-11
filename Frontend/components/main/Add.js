import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function Add({ navigation }) {
  const [CPermission, setCPermission] = useState(null);
  const [GPermission, setGPermission] = useState(null);
  const [Picture, setPicture] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const handleTakePicture = async () => {
    if (Picture) {
      const data = await Picture.takePictureAsync(null);
      setImage(data?.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      const Cstatus = await Camera.requestPermissionsAsync();
      setCPermission(Cstatus?.status === "granted");

      const Gstatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGPermission(Gstatus?.status === "granted");
    })();
  }, []);

  if (CPermission === null || GPermission === false) {
    return <View />;
  }
  if (CPermission === false || GPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={type}
          ratio={"1:1"}
          ref={(ref) => setPicture(ref)}
        />
      </View>
      <Button
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      ></Button>
      <Button title="Take Picture" onPress={handleTakePicture} />
      <Button title="Pic Image" onPress={pickImage} />
      <Button
        title="Save"
        onPress={() => navigation.navigate("Save", { image })}
      />
      {image && <Image source={{ uri: image }} style={styles.picture} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  picture: {
    flex: 1,
  },
});
