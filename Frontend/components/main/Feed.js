import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";
import { connect } from "react-redux";
import { db, auth } from "../../firebase";

const Feed = (props) => {
  const [posts, setPosts] = useState([]);
  console.log(posts);

  useEffect(() => {
    if (
      props.userFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort((x, y) => {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
  }, [props.userFollowingLoaded, props.feed]);

  const handleLike = (userId, postId) => {
    db.collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(auth.currentUser.uid)
      .set({});
  };

  const handleDisLike = (userId, postId) => {
    db.collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(auth.currentUser.uid)
      .delete();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user?.Name}</Text>
              <Image style={styles.image} source={{ uri: item?.downloadURL }} />
              {item.currentUserLike ? (
                <Button
                  title="Dislike"
                  onPress={() => handleDisLike(item.user?.uid, item.id)}
                />
              ) : (
                <Button
                  title="Like"
                  onPress={() => handleLike(item.user?.uid, item.id)}
                />
              )}
              <Text
                onPress={() =>
                  props.navigation.navigate("Comment", {
                    postId: item.id,
                    uid: item.user?.uid,
                  })
                }
              >
                View Comments...
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
});

const MapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  userFollowingLoaded: store.allUserState.userFollowingLoaded,
  feed: store.allUserState.feed,
});
export default connect(MapStateToProps, null)(Feed);
