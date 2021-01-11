import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../firebase";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSignUp = () => {
    auth
      .signInWithEmailAndPassword(Email, Password)
      .then((res) => {
        console.log("You Are Logged IN");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={(Email) => setEmail(Email)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(Password) => setPassword(Password)}
      />
      <Button onPress={handleSignUp} title="Sign In" />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
