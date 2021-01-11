import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";
import { connect } from "react-redux";
import { auth, db } from "../../firebase";

const Profile = (props) => {
  const [userPost, setUserPost] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const Follow = () => {
    db.collection("following")
      .doc(auth.currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  const Unfollow = () => {
    db.collection("following")
      .doc(auth.currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const Logout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const { currentUser, posts } = props;
    if (props.route.params.uid == auth.currentUser.uid) {
      setUser(currentUser);
      setUserPost(posts);
    } else {
      db.collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("Error");
          }
        });
      db.collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPost(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  if (user == null) {
    return <View />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text>{user.Name}</Text>
        <Text>{user.Email}</Text>
        {props.route.params.uid !== auth.currentUser.uid ? (
          <View>
            {following ? (
              <Button title="Following" onPress={Unfollow} />
            ) : (
              <Button title="Follow" onPress={Follow} />
            )}
          </View>
        ) : (
          <Button title="Log-Out" onPress={Logout} />
        )}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPost}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const MapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});
export default connect(MapStateToProps, null)(Profile);

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
