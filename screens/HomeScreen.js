import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import SafeArea from "../layouts/HomeLayout";
import { Text, H1, Input } from "../components/Comp";
import Chat from "../components/Chat";
import DUMMY_DATA from "../data/DUMMY_DATA";
import SearchIcon from "../components/SearchIcon";


const HomeScreen = (props) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState(Array());
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const uid = useSelector((state) => state.user.value);
  const socketRef = useRef();

  useEffect(() => {
    fetch("http://api.sharkbait-app.ml/users/" + uid)
      .then(json => json.json())
      .then(response => {
        setUserInfo(response);
      })
  }, [])

  useEffect(() => {
    if (!loaded) {
      fetch("http://api.sharkbait-app.ml/users/" + uid + "/chats")
        .then((json) => json.json())
        .then((response) => {
          if (response.error) console.log(error);
          else if (response.length > 0) {
            sortChats(response);
            setLoaded(true);
          } else {
            sortChats(Array());
            setLoaded(true);
          }
        });
    }
  }, []);

  useEffect(() => {
    const socket = io("http://sharkbait-app.ml");

    socket.on("connect", () => {
      socket.emit('userConnection', uid);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socketRef.current = socket;
    
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if(socketRef.current) {
      socketRef.current.on("chatUpdate", (chat, who) => {
        updateChats(chat);
      });
    }

  }, [socketRef.current])

  const sortChats = (chats) => {
    chats.sort((a, b) => new Date(b.last_update) - new Date(a.last_update));
    setChats(chats);
  };

  const updateChats = (chat) => {
    var currChats = chats;
    for (let i = 0; i < currChats.length; i++) {
      if (currChats[i].chat_id == chat.chat_id) {
        currChats.splice(i, 1);
        break;
      }
    }

    currChats.unshift(chat);
    setChats(currChats);
  }

  return (
    <SafeArea navigation={props.navigation} userInfo={userInfo}>
      <View style={styles.head}>
        <View style={styles.searchContainer}>
          <SearchIcon value={search} onChangeText={setSearch} />
        </View>
        <H1 style={styles.h1}>Recent Chats</H1>
      </View>
      <Animated.FlatList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={styles.chatList}
        keyExtractor={(item) => Math.random().toString()}
        data={chats.filter((chat) =>
          chat.members
            .map((member) => member.displayname)
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase())
        )}
        renderItem={(itemData) => (
          <Chat
            {...props}
            data={itemData.item}
            scrollY={scrollY}
            index={itemData.index}
          />
        )}
      />
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  head: {
    paddingHorizontal: 20,
  },

  searchContainer: {
    marginRight: 100,
    marginVertical: 10,
  },

  search: {
    borderRadius: 25,
  },

  searchInput: {
    // fontSize: Size.small,
    // paddingVertical: 5,
  },

  chatList: {
    paddingHorizontal: 20,
    paddingBottom: 210,
    // paddingTop: 20
  },
});

export default HomeScreen;
