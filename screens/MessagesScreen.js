import React, { useEffect, useRef, useState, useCallback } from "react";
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

var timeout;

const MessagesScreen = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [typing, setTyping] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const flatListRef = useRef();
  const uid = useSelector((state) => state.user.value);
  const chat = props.route.params;
  const chatID = chat.chat_id;
  const name = chat.name;

  useEffect(() => {
    const socket = io("http://sharkbait-app.ml");

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.emit("getMessages", chatID, (response) => {
      setMessages(response);
      setLoaded(true);
    });

    socket.on("typing", (data) => {
      if (data.uid != uid) {
        setTyping(data.typing);

        clearTimeout(timeout);

        timeout = setTimeout(() => {
          setTyping(false);
        }, 2000);
      }
    });

    socket.on("newMessage", (data) => {
      if (data.uid != uid) addMessage(data.uid, data.msg);
    });

    socketRef.current = socket;

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const addMessage = (id, msg) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        uid: id,
        msg: msg,
      },
    ]);
  };

  const sendMessage = () => {
    if (msg != "" && loaded) {
      const sentMessage = msg;
      socketRef.current.emit(
        "sendMessage",
        { chat_id: chatID, msg: sentMessage, uid: uid },
        (response) => {
          if (response.error) console.log(response);
        }
      );
      addMessage(uid, sentMessage);
      sendTyping("");
    }
  };

  const sendTyping = (text) => {
    if (text == "") {
      socketRef.current.emit("typing", {
        chat_id: chatID,
        uid: uid,
        typing: false,
      });
    } else {
      socketRef.current.emit("typing", {
        chat_id: chatID,
        uid: uid,
        typing: true,
      });
    }

    setMsg(text);
  };

  const group = useCallback(
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
      <ChatTitle navigation={props.navigation} name={name} img={require("../assets/avatar.png")} />
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
            data={[...messages, { typing: typing }]}
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
