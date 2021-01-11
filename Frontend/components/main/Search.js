import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { db } from "../../firebase";

const Search = (props) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    db.collection("users")
      .where("Name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Search Here...."
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
            <Text>{item.Name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
