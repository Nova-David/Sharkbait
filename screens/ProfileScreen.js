import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import SafeArea from "../layouts/EmptyLayout";

import ChatTitle from "../components/ChatTitle";
import Avatar from "../components/Avatar";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import { Text } from "../components/Comp";
import Icon from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { SocketContext } from "../socket/Socket";

const NOT_FRIENDS = 0;
const REQUEST_SENT = 1;
const FRIENDS = 2;
const REQUEST_RECEIVED = 4;

const Sub = (props) => {
  const title = props.title;

  return (
    <View style={styles.tag}>
      <Text style={styles.subText}>{title}</Text>
    </View>
  );
};

const ProfileScreen = (props) => {
  const { data: user, requests } = useSelector((state) => state.user);
  const uid = user.uid;
  const [profile, setProfile] = useState();
  const ctx = useContext(SocketContext);

  const [configuration, setConfiguration] = useState({
    style: { opacity: 0.4 },
    handler: () => {},
  });

  useEffect(() => {
    /* Get user information for visited profile */
    fetch("http://api.sharkbait-app.ml/users/" + props.route.params.uid)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  useEffect(() => {
    /* Checks friend status between visited profile and visiting user */
    if (profile != undefined) {
      let status = NOT_FRIENDS;

      if (profile.friends && profile.friends.includes(uid)) status = FRIENDS;
      else if (profile.requests && profile.requests.includes(uid))
        status = REQUEST_SENT;
      else if (
        requests &&
        requests.filter((req) => req.uid == profile.uid).length > 0
      )
        status = REQUEST_RECEIVED;

      updateFriendStatus(status);
    }
  }, [profile]);

  const updateFriendStatus = (status) => {
    /* Updates friend button based on friend status */
    switch (status) {
      case FRIENDS:
        setConfiguration({
          style: { backgroundColor: Theme.green },
          handler: unfriendHandler,
        });
        break;
      case NOT_FRIENDS:
        setConfiguration({
          style: {},
          handler: addFriendHandler,
        });
        break;
      case REQUEST_SENT:
        setConfiguration({
          style: { opacity: 0.4 },
          handler: requestSentHandler,
        });
        break;
      case REQUEST_RECEIVED:
        setConfiguration({
          style: { backgroundColor: Theme.dim },
          handler: acceptRequestHandler,
        });
        break;
    }
  };

  if (profile == undefined) {
    return (
      <SafeArea>
        <ChatTitle
          navigation={props.navigation}
          name={
            uid != props.route.params.uid
              ? props.route.params.displayname + "'s Profile"
              : "My Profile"
          }
        />
        <View style={styles.icons}>
          <Text style={styles.uid}></Text>
        </View>
        <View
          style={{
            ...styles.content,
            ...{ marginTop: 20 },
          }}
        >
          <View style={styles.top}>
            <Avatar style={styles.avatar} />
          </View>
          <View style={styles.section}></View>
        </View>
      </SafeArea>
    );
  }

  const startChatHandler = () => {
    /* Creates a new chat if one doesn't already exist with this user */
    fetch("http://api.sharkbait-app.ml/chats/init", {
      method: "POST",
      body: JSON.stringify({ uid: uid, friend: profile.uid }),
      headers: { "Content-Type": "application/json" },
    })
      .then((json) => json.json())
      .then((response) => {
        props.navigation.navigate("Messages", {
          chat_id: response.uuid,
          name: profile.displayname,
          members: [{ uid: profile.uid, displayname: profile.displayname }],
        });
      });
  };

  const sendRequest = () => {
    /* Sends a friend request message to the socket */
    console.log("sending request", profile.uid);
    ctx.sendRequest(user, profile.uid);
    updateFriendStatus(REQUEST_SENT);
  };

  const acceptRequest = () => {
    /* Sends an accept request message to the socket */
    console.log("accepting request", profile.uid);
    ctx.acceptRequest(user, profile);
    updateFriendStatus(FRIENDS);
  };

  const rejectRequest = () => {
    /* Sends a reject request message to the socket */
    console.log("rejecting request", profile.uid);
    ctx.rejectRequest(user, profile);
    updateFriendStatus(NOT_FRIENDS);
  };

  const unfriend = () => {
    /* Sends an unfriend message to the socket */
    console.log("unfriending", profile.uid);
    ctx.unfriend(user, profile);
    updateFriendStatus(NOT_FRIENDS);
  };

  const addFriendHandler = () => {
    /* Alert box for sending a friend request */
    Alert.alert("Send " + profile.uid + " a friend request?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Yes", onPress: sendRequest },
    ]);
    return;
  };

  const acceptRequestHandler = () => {
    /* Alert box for accepting a friend request */
    Alert.alert("Accept " + profile.uid + "'s friend request?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Accept", onPress: acceptRequest },
      { text: "Reject", onPress: rejectRequest, style: "destructive" },
    ]);
    return;
  };

  const requestSentHandler = () => {
    /* Alert box for rejecting a friend request */
    Alert.alert("A friend request has already been sent.", "", [
      {
        text: "Okay",
        style: "cancel",
      },
    ]);
    return;
  };

  const unfriendHandler = () => {
    /* Alert box for unfriending a user */
    Alert.alert("Unfriend " + profile.uid + "?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Yes", onPress: unfriend },
    ]);
    return;
  };

  return (
    <SafeArea>
      <ChatTitle
        navigation={props.navigation}
        name={
          uid != profile.uid ? profile.displayname + "'s Profile" : "My Profile"
        }
      />
      <View style={styles.icons}>
        {uid != profile.uid && (
          <TouchableOpacity activeOpacity={0.8} onPress={startChatHandler}>
            <View style={styles.icon}>
              <Icon name="message1" size={30} color={Theme.primary} />
            </View>
          </TouchableOpacity>
        )}
        <Text style={styles.uid}>@{profile.uid}</Text>
        {uid != profile.uid && (
          <TouchableOpacity activeOpacity={0.8} onPress={configuration.handler}>
            <View style={{ ...styles.icon, ...configuration.style }}>
              <Icon name="smileo" size={30} color={Theme.primary} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          ...styles.content,
          ...{ marginTop: uid == profile.uid ? 60 : 20 },
        }}
      >
        <View style={styles.top}>
          <Avatar style={styles.avatar} />
        </View>
        <View style={styles.section}>
          {profile.interests
            ? profile.interests.map((sub, ind) => <Sub key={ind} title={sub} />)
            : null}
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Theme.lighter,
    marginTop: 20,
    borderTopStartRadius: 70,
    borderTopEndRadius: 70,
  },

  avatar: {
    backgroundColor: Theme.darker,
    width: 90,
    height: 90,
    marginTop: -45,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },

  top: {
    alignItems: "center",
  },

  uid: {
    color: Theme.accent,
    fontSize: Size.small,
    marginTop: -10,
    marginLeft: -5,
  },

  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    paddingHorizontal: 40,
  },

  icon: {
    backgroundColor: Theme.lighter,
    padding: 10,
    borderRadius: 100,
  },

  section: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  tag: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Theme.accent,
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },

  subText: {
    fontSize: Size.small,
  },
});

export default ProfileScreen;
