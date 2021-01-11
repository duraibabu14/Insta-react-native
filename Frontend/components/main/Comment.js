import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
} from "react-native";
import { db, auth } from "../../firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";

const Comment = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  console.log(comments);
  const saveComment = () => {
    db.collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.uid)
      .collection("comments")
      .add({
        creater: auth.currentUser.uid,
        text: text,
      });
  };

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = props.allusers.find((x) => x.uid === comments[i].creater);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creater, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }
    if (props.route.params.postId !== postId) {
      db.collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.uid)
        .collection("comments")
        .get()
        .then((snaphot) => {
          let comments = snaphot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.allusers]);
  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ? <Text>{item.user?.Name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder="Comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={saveComment} title="Send a Comment" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

const MapStateToProps = (store) => ({
  allusers: store.allUserState.allusers,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(MapStateToProps, mapDispatchProps)(Comment);
