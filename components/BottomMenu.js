import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Theme from "../const/Colors";
import Size from "../const/Sizes";
import { Text } from "./Comp";
import Icon from "react-native-vector-icons/AntDesign";
import PopupMenu from "./PopupMenu";

const BottomMenu = (props) => {
  const [popup, setPopup] = useState(false);

  const toggleMenuHandler = () => {
    if (popup) setPopup(false);
    else setPopup(true);
  };

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <View style={styles.cover} />
      <SafeAreaView>
        <ImageBackground
          source={require("../assets/left.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.buttonsContainer}>
            {popup && <PopupMenu {...props} close={() => setPopup(false)} />}
            <View style={styles.large}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  props.navigation.navigate("HomeTab");
                }}
              >
                <Image
                  source={require("../assets/chats.png")}
                  style={styles.largeIcon}
                />
                <Text style={{ textAlign: "center", marginTop: 10 }}>
                  Chats
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.add}>
              <TouchableOpacity activeOpacity={0.8} onPress={toggleMenuHandler}>
                <Icon name="plussquareo" size={50} color={Theme.accent} />
              </TouchableOpacity>
            </View>
            <View style={styles.small}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  props.navigation.navigate("FriendsTab");
                }}
              >
                <Image
                  source={require("../assets/friends.png")}
                  style={styles.smallIcon}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontSize: Size.small,
                  }}
                >
                  Friends
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 210,
    overflow: "hidden",
    // backgroundColor: 'red'
  },

  cover: {
    height: 50,
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: Theme.darker,
  },

  image: {
    // backgroundColor: 'green',
    width: "100%",
    height: 210,
    flex: 1,
  },

  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    // paddingHorizontal: 10,
  },

  add: {
    height: 100,
    justifyContent: "center",
  },

  large: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
  },

  largeIcon: {
    width: 75,
    height: 95,
  },

  small: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
  },

  smallIcon: {
    width: 55,
    height: 50,
  },
});

export default BottomMenu;
