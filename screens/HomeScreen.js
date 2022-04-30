import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

import SafeArea from "../layouts/HomeLayout";
import { Text, H1 } from "../components/Comp";
import Chat from "../components/Chat";
import SearchIcon from "../components/SearchIcon";

const HomeScreen = (props) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { data: user, chats } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");

  const sortChats = (chats) => {
    /* Sort chats by latest message sent */
    return chats.sort(
      (a, b) => new Date(b.last_update) - new Date(a.last_update)
    );
  };

  const organize = (chats, search) => {
    /* Filter chats based on search and then sort by latest message */
    let res = Object.values(chats);
    search = search.toLowerCase();

    res = res.filter((chat) => {
      if (chat.title) return chat.title.toLowerCase().includes(search);

      return chat.members.filter((member) =>
        member.displayname.toLowerCase().includes(search)
      ).length > 0;
    });

    return sortChats(res);
  };

  return (
    <SafeArea navigation={props.navigation}>
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
        keyExtractor={(item, ind) => ind}
        data={
          chats
            ? organize(chats, search)
            : [null]
        }
        renderItem={(itemData) => {
          if (!itemData.item) return <Text></Text>;
          else
            return (
              <Chat
                navigation={props.navigation}
                chat={itemData.item.chat_id}
                scrollY={scrollY}
                index={itemData.index}
              />
            );
        }}
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

  chatList: {
    paddingHorizontal: 20,
    paddingBottom: 210,
  },
});

export default HomeScreen;
