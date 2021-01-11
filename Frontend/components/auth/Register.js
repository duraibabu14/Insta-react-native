import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebase";

const Register = () => {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(Email, Password)
      .then((res) => {
        db.collection("users").doc(auth.currentUser.uid).set({
          Name,
          Email,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View>
      <TextInput placeholder="Name" onChangeText={(Name) => setName(Name)} />
      <TextInput
        placeholder="Email"
        onChangeText={(Email) => setEmail(Email)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(Password) => setPassword(Password)}
      />
      <Button onPress={handleSignUp} title="Sign Up" />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({});
