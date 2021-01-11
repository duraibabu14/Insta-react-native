import { combineReducers } from "redux";
import { allusers } from "./allusers";
import { user } from "./user";

const Reducers = combineReducers({
  userState: user,
  allUserState: allusers,
});

export default Reducers;
