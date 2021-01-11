import React, { useState } from "react";
import { StyleSheet, TextInput, View, Image, Button } from "react-native";
import { storage, auth, db } from "../../firebase";
import firebase from "firebase";

const Save = (props) => {
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = storage.ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    db.collection("posts")
      .doc(auth.currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop();
      });
  };
  return (
    <View style={styles.container}>
      <Image source={{ uri: props.route.params.image }} />

      <TextInput
        placeholder="Write a Caption...."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Post" onPress={uploadImage} />
    </View>
  );
};

export default Save;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
