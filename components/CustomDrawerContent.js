import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userReducer";
import Icon from "react-native-vector-icons/AntDesign";

import { Text } from "./Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import Avatar from "./Avatar";
import { TouchableOpacity } from "react-native-gesture-handler";

const DrawerItem = (props) => {
  const color = props.index == props.active ? Theme.white : Theme.white;
  const bg = props.index == props.active ? Theme.darker : Theme.lighter;
  return (
    <TouchableOpacity
      style={{ ...styles.touch, ...{ marginTop: 10 } }}
      activeOpacity={0.8}
      onPress={props.onPress}
    >
      <View style={{...styles.navItem, ...{backgroundColor: bg}}}>
        <Icon name={props.name} size={30} color={color} />
        <Text style={{ ...styles.navText, ...{ color: color } }}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CustomDrawerContent = (props) => {
  const [userInfo, setUserInfo] = useState({
    loaded: false,
    displayname: '...'
  });

  const dispatch = useDispatch();
  const uid = useSelector((state) => state.user.value);

  const logoutHandler = () => {
    /* Logout */
    dispatch(logout());
  };

  useEffect(() => {
    if (uid == null) props.navigation.replace("Login");
  }, [uid]);

  useEffect(() => {
    fetch("http://api.sharkbait-app.ml/users/" + uid).then(json => {
      return json.json();
    }).then(response => {
      if (!response.error) {
        setUserInfo(response);
      }
    });
  }, [])

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawer}>
        <Avatar style={styles.avatar} />
        <Text style={styles.displayname}>{userInfo.displayname}</Text>
        <Text style={styles.uid}>@{uid}</Text>
        <DrawerItem
          name="home"
          label="Home"
          index={props.state.index}
          active={0}
          onPress={() => {
            props.navigation.navigate("NavHome");
          }}
        />
        <DrawerItem
          name="slack"
          label="Interests"
          index={props.state.index}
          active={1}
          onPress={() => {
            props.navigation.navigate("Interests");
          }}
        />
        <DrawerItem
          name="setting"
          label="Settings"
          index={props.state.index}
          active={2}
          onPress={() => {
            props.navigation.navigate("Settings");
          }}
        />
        <TouchableOpacity
          style={styles.touch}
          activeOpacity={0.8}
          onPress={logoutHandler}
        >
          <View style={{ ...styles.navItem, ...styles.logout }}>
            <Text style={{ ...styles.navText, ...{ color: Theme.red } }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <DrawerItem
        icon={(focused, color) => {
          return <Icon name='home' size={50} color={Theme.white} />
        }}
        label="Settings"
        labelStyle={styles.navText}
        style={styles.navItem}
        activeTintColor={Theme.red}
        onPress={() => {
          props.navigation.navigate("Settings");
        }}
      /> */}
      {/* <DrawerItem
        label="Logout"
        style={styles.navItem}
        onPress={logoutHandler}
      /> */}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: Theme.primary,
  },

  drawer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },

  displayname: {
    marginTop: 10
  },

  uid: {
    fontSize: Size.small,
    color: Theme.accent,
    marginTop: 5,
    marginBottom: 10,
  },

  navItem: {
    backgroundColor: Theme.lighter,
    color: Theme.white,
    width: "100%",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  touch: {
    marginTop: 20,
    width: "100%",
  },

  navText: {
    flex: 1,
    color: Theme.white,
    textAlign: "center",
  },

  logout: {
    marginTop: 0,
    padding: 10,
    backgroundColor: "transparent",
  },

  avatar: {
    backgroundColor: Theme.lighter,
  },
});

export default CustomDrawerContent;
