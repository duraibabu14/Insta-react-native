import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./components/auth/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { auth } from "./firebase";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import Main from "./components/Main";
import Add from "./components/main/Add";
import Save from "./components/main/Save";
import Comment from "./components/main/Comment";

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();

export default function App(props) {
  const [user, setuser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setuser(authUser);
      } else {
        setuser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen
            name="Add"
            component={Add}
            navigation={props.navigation}
          />
          <Stack.Screen
            name="Save"
            component={Save}
            navigation={props.navigation}
          />
          <Stack.Screen
            name="Comment"
            component={Comment}
            navigation={props.navigation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
