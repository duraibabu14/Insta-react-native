import {
  ALL_USERS_LIKE_STATE_CHANGE,
  ALL_USERS_POST_STATE_CHANGE,
  ALL_USERS_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

const initialState = {
  allusers: [],
  userFollowingLoaded: 0,
  feed: [],
};

export const allusers = (state = initialState, action) => {
  switch (action.type) {
    case ALL_USERS_POST_STATE_CHANGE:
      return {
        ...state,
        userFollowingLoaded: state.userFollowingLoaded + 1,
        feed: [...state.feed, ...action.posts],
      };
    case ALL_USERS_LIKE_STATE_CHANGE:
      return {
        ...state,
        feed: state.feed.map((post) =>
          post.id == action.postId
            ? { ...post, currentUserLike: action.currentUserLike }
            : post
        ),
      };

    case ALL_USERS_STATE_CHANGE:
      return {
        ...state,
        allusers: [...state.allusers, action.user],
      };

    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
