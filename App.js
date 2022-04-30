import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./store/store";
import Toast from "react-native-toast-message";

import AppNavigation from "./routes/AppNavigation";
import SocketProvider from "./socket/Socket";

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
        <Toast />
      </SocketProvider>
    </Provider>
  );
}
