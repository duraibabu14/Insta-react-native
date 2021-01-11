import { auth, db } from "../../firebase";
import {
  USER_POST_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  ALL_USERS_STATE_CHANGE,
  ALL_USERS_POST_STATE_CHANGE,
  CLEAR_DATA,
  ALL_USERS_LIKE_STATE_CHANGE,
} from "../constants/index";

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export function fetchUser() {
  return (dispatch) => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("Error");
        }
      });
  };
}
export function fetchUserPosts() {
  return (dispatch) => {
    db.collection("posts")
      .doc(auth.currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POST_STATE_CHANGE, posts });
      });
  };
}
export function fetchUserFollowing() {
  return (dispatch) => {
    db.collection("following")
      .doc(auth.currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true));
        }
      });
  };
}
export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().allUserState.allusers.some((el) => el.uid === uid);
    if (!found) {
      db.collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({ type: ALL_USERS_STATE_CHANGE, user });
          } else {
            console.log("Error");
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    db.collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        const uid = snapshot._.query.C_.Ft.path.segments[1];
        const user = getState().allUserState.allusers.find(
          (el) => el.uid === uid
        );

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        for (let i = 0; i < posts.length; i++) {
          dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
        }
        dispatch({ type: ALL_USERS_POST_STATE_CHANGE, posts, uid });
      });
  };
}

export function fetchUsersFollowingLikes(uid, postId) {
  return (dispatch) => {
    db.collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        const postId = snapshot.ZE?.path.segments[3];

        let currentUserLike = false;
        if (snapshot.exists) {
          currentUserLike = true;
        }

        dispatch({
          type: ALL_USERS_LIKE_STATE_CHANGE,
          postId,
          currentUserLike,
        });
      });
  };
}
