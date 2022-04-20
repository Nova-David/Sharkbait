import React from "react";
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import BottomMenu from "../components/BottomMenu";

import Theme from "../const/Colors";
import Size from "../const/Sizes";

const SafeArea = (props) => {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={Platform.OS === "ios" ? -30 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.nav}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                props.navigation.openDrawer();
              }}
              style={styles.touchable}
            >
              <View style={styles.touchable}></View>
              <ImageBackground
                source={require("../assets/menu-bg.png")}
                style={styles.menubg}
              />
              <SafeAreaView style={styles.testContainer}>
                <View style={styles.navcontainer}>
                  <Icon name="menu" size={Size.larger} color={Theme.accent} />
                </View>
              </SafeAreaView>
            </TouchableOpacity>
          </View>
          <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
            {props.children}
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.primary,
  },

  container: {
    flex: 1,
  },

  nav: {
    width: 100,
    height: 120,
    position: "absolute",
    top: 0,
    right: 0,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    zIndex: 1,
  },

  touchable: {
    // backgroundColor: "red",
    width: "100%",
    height: "100%",
  },

  menubg: {
    top: -10,
    right: -35,
    width: 140,
    height: 140,
    justifyContent: "center",
    position: "absolute",
  },

  testContainer: {
    // backgroundColor: "blue",
    position: "absolute",
    right: 25,
  },

  navcontainer: {
    // backgroundColor: "green",
    paddingVertical: 17,
    // marginTop: 20,
    // marginLeft: 10,
  },
});

export default SafeArea;
