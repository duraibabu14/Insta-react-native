import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const Landing = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      ></Button>
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")}
      ></Button>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({});
