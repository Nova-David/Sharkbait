import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import ChatTitle from "../components/ChatTitle";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import { Text, Input } from "../components/Comp";
import Message from "../components/Message";
import Typing from "../components/Typing";
import SafeArea from "../layouts/ChatLayout";
import Theme from "../const/Colors";
import Icon from "react-native-vector-icons/Feather";
import { SocketContext } from "../socket/Socket";

var timeout;

const MessagesScreen = (props) => {
  const [typing, setTyping] = useState(false);
  const [msg, setMsg] = useState("");
  const flatListRef = useRef();
  const { data: user } = useSelector(state => state.user);
  const uid = user.uid;
  const chat = props.route.params;
  const loaded = useSelector((state) => state.chats.loaded[chat.chat_id]);
  const messages = useSelector((state) => state.chats[chat.chat_id]);
  const ctx = useContext(SocketContext);

  useEffect(() => {
    /* Connect web socket to specific chat */
    ctx.joinChat(chat.chat_id);

    ctx.socket.on("typing", (data) => {
      /* Update a timeout when another user types */
      if (data.uid != uid) {
        setTyping(data.typing);

        clearTimeout(timeout);

        timeout = setTimeout(() => {
          setTyping(false);
        }, 2000);
      }
    });

    return () => {
      /* Disconnect web socket from chat */
      clearTimeout(timeout);
      ctx.leaveChat(chat.chat_id);
    };
  }, []);

  const sendMessage = () => {
    /* Handler for when the user sends a message to the chat */
    if (msg != "" && loaded) {
      console.log("Ready to send message", msg);

      const newMessage = {
        chat_id: chat.chat_id,
        msg: msg,
        uid: uid,
      };

      ctx.sendMessage(newMessage, chat.members, user);

      sendTyping("");
    }
  };

  const sendTyping = (text) => {
    /* Handler for when the user types in the chat */
    let typingUpdate = {
      chat_id: chat.chat_id,
      uid: uid,
      typing: false,
    };
    if (text == "") ctx.sendTyping(typingUpdate);
    else {
      typingUpdate.typing = true;
      ctx.sendTyping(typingUpdate);
    }

    setMsg(text);
  };

  const group = useCallback(
    /* Styles chat bubbles based on previous and next chat bubbles, to group together bubbles sent by the same user */
    (ind) => {
      let x = {};

      if (ind >= 0) {
        if (messages[ind].uid == messages[ind + 1].uid) x = { marginTop: 0 };
      }

      if (ind + 1 < messages.length - 1) {
        if (messages[ind + 1].uid == messages[ind + 2].uid)
          x = { ...x, ...{ marginBottom: 3 } };
      }

      if (x.marginBottom == 3) {
        const borderEnd =
          messages[ind + 1].uid == uid
            ? { borderBottomEndRadius: 25 }
            : { borderBottomStartRadius: 25 };
        x = { ...x, ...borderEnd };
      }

      if (Object.keys(x).length == 0) return null;
      else return x;
    },
    [messages]
  );

  return (
    <SafeArea>
      <ChatTitle
        navigation={props.navigation}
        name={chat.name}
        img={require("../assets/avatar.png")}
      />
      <View style={styles.main}>
        <View onStartShouldSetResponder={() => true} style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current.scrollToEnd({ animated: true })
            }
            style={styles.messagesContainer}
            contentContainerStyle={styles.messages}
            keyExtractor={(item) => Math.random().toString()}
            data={messages ? [...messages, { typing: typing }] : []}
            renderItem={(itemData) => {
              if ("typing" in itemData.item) {
                if (itemData.item.typing === true && loaded) {
                  let ind = itemData.index;
                  let x = null;

                  if (ind > 0) {
                    if (messages[ind - 1].uid != uid) x = { marginTop: -3 };
                  }

                  return <Typing bubbleStyle={x} />;
                } else return;
              }

              return (
                <Message
                  sender={itemData.item.uid == uid}
                  bubbleStyle={group(itemData.index - 1)}
                >
                  {itemData.item.msg}
                </Message>
              );
            }}
          />
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <Input
            placeholder="Send a message here..."
            color={Theme.lighter}
            style={styles.inputContainer}
            inputStyle={styles.input}
            value={msg}
            onChangeText={sendTyping}
            onFocus={() => {
              setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
              }, 100);
            }}
          >
            <TouchableOpacity
              style={styles.icon}
              activeOpacity={0.8}
              onPress={sendMessage}
            >
              <Icon name="send" size={25} color={Theme.accent} />
            </TouchableOpacity>
          </Input>
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Theme.lighter,
    flex: 1,
    marginTop: 0,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    overflow: "hidden",
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  messages: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  inputContainer: {
    backgroundColor: Theme.darker,
    paddingVertical: 5,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 5,
  },

  input: {},

  icon: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MessagesScreen;
