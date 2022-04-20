import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import SafeArea from "../layouts/EmptyLayout";

import ChatTitle from "../components/ChatTitle";
import Avatar from "../components/Avatar";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import { Text } from "../components/Comp";
import Icon from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";

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
  const uid = useSelector((state) => state.user.value);
  const user = props.route.params;
  const [loaded, setLoaded] = useState(false);
  const [friendStatus, setFriendStatus] = useState();
  const [friendStyle, setFriendStyle] = useState({ opacity: 0.4 });
  const [friendHandler, setFriendHandler] = useState(() => {});

  useEffect(() => {
    if (user.friends && user.friends.includes(uid)) {
      setFriendStatus(FRIENDS);
      setLoaded(true);
    } else if (user.requests && user.requests.includes(uid)) {
      setFriendStatus(REQUEST_SENT);
      setLoaded(true);
    } else {
      fetch("http://api.sharkbait-app.ml/users/" + uid)
        .then((json) => json.json())
        .then((response) => {
          if (response.error) console.log(response.error);
          else {
            if (response.requests && response.requests.includes(user.uid))
              setFriendStatus(REQUEST_RECEIVED);
            else setFriendStatus(NOT_FRIENDS);
          }
        });
    }
  }, []);

  const startChatHandler = () => {
    fetch("http://api.sharkbait-app.ml/chats/init", {
      method: "POST",
      body: JSON.stringify({ uid: uid, friend: user.uid }),
      headers: { "Content-Type": "application/json" },
    })
      .then((json) => json.json())
      .then((response) => {
        props.navigation.navigate("Messages", {
          chat_id: response.uuid,
          name: user.displayname,
        });
      });
  };

  const unfriend = () => {
    console.log(uid, user.uid);
    fetch("http://api.sharkbait-app.ml/friends/remove", {
      method: "POST",
      body: JSON.stringify({ uid: uid, friend: user.uid }),
      headers: { "Content-Type": "application/json" },
    })
      .then((json) => json.json())
      .then((response) => {
        if (response.error) console.log(response.error);
        else {
          setFriendStatus(NOT_FRIENDS);
        }
      });
  };

  const sendRequest = () => {
    fetch("http://api.sharkbait-app.ml/friends/add", {
      method: "POST",
      body: JSON.stringify({ uid: uid, friend: user.uid }),
      headers: { "Content-Type": "application/json" },
    })
      .then((json) => json.json())
      .then((response) => {
        if (response.error) console.log(response.error);
        else {
          setFriendStatus(REQUEST_SENT);
        }
      });
  };

  const acceptRequest = () => {
    fetch("http://api.sharkbait-app.ml/friends/accept", {
      method: "POST",
      body: JSON.stringify({ uid: uid, friend: user.uid }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.error) console.log(response.error);
      else {
        setFriendStatus(FRIENDS);
      }
    });
  };

  const rejectRequest = () => {
    fetch("http://api.sharkbait-app.ml/friends/reject", {
      method: "POST",
      body: JSON.stringify({ uid: uid, friend: user.uid }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.error) console.log(response.error);
      else {
        setFriendStatus(NOT_FRIENDS);
      }
    });
  };

  const unfriendHandler = (status) => {
    Alert.alert("Unfriend " + user.uid + "?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Yes", onPress: unfriend },
    ]);
    return;
  };

  const addFriendHandler = (status) => {
    Alert.alert("Send " + user.uid + " a friend request?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Yes", onPress: sendRequest },
    ]);
    return;
  };

  const requestSentHandler = (status) => {
    Alert.alert("A friend request has already been sent.", "", [
      {
        text: "Okay",
        style: "cancel",
      },
    ]);
    return;
  };

  const acceptRequestHandler = (status) => {
    Alert.alert("Accept " + user.uid + "'s friend request?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Accept", onPress: acceptRequest },
      { text: "Reject", onPress: rejectRequest, style: "destructive" },
    ]);
    return;
  };

  useEffect(() => {
    console.log("Time to switch", friendStatus);
    switch (friendStatus) {
      case FRIENDS:
        setFriendStyle({ backgroundColor: Theme.green });
        setFriendHandler(() => unfriendHandler);
        break;
      case NOT_FRIENDS:
        setFriendStyle({});
        setFriendHandler(() => addFriendHandler);
        break;
      case REQUEST_SENT:
        setFriendHandler(() => requestSentHandler);
        setFriendStyle({ opacity: 0.4 });
        break;
      case REQUEST_RECEIVED:
        setFriendHandler(() => acceptRequestHandler);
        setFriendStyle({ backgroundColor: Theme.dim });
        break;
    }
  }, [friendStatus]);

  return (
    <SafeArea>
      <ChatTitle
        navigation={props.navigation}
        name={uid != user.uid ? user.displayname + "'s Profile" : "My Profile"}
      />
      <View style={styles.icons}>
        {uid != user.uid && (
          <TouchableOpacity activeOpacity={0.8} onPress={startChatHandler}>
            <View style={styles.icon}>
              <Icon name="message1" size={30} color={Theme.primary} />
            </View>
          </TouchableOpacity>
        )}
        <Text style={styles.uid}>@{user.uid}</Text>
        {uid != user.uid && (
          <TouchableOpacity activeOpacity={0.8} onPress={friendHandler}>
            <View style={{ ...styles.icon, ...friendStyle }}>
              <Icon name="smileo" size={30} color={Theme.primary} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          ...styles.content,
          ...{ marginTop: uid == user.uid ? 60 : 20 },
        }}
      >
        <View style={styles.top}>
          <Avatar style={styles.avatar} />
          {/* <Text>{user.displayname}</Text> */}
        </View>
        <View style={styles.section}>
          {user.interests ? user.interests.map((sub, ind) => (
            <Sub key={ind} title={sub} />
          )): null}
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
