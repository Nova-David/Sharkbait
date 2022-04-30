import React, { createContext, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { useDispatch } from "react-redux";

import {
  addRequest,
  removeRequest,
  addFriend,
  removeFriend,
  createChat,
  updateChat,
} from "../store/userReducer";
import { addMessage, loadChat } from "../store/chatsReducer";

const SocketContext = createContext(null);

export { SocketContext };

/* WEB SOCKET */

export default ({ children }) => {
  const dispatch = useDispatch();
  const {
    valid: isLoggedIn,
    data: user,
    chats: userChats,
  } = useSelector((state) => state.user);
  let socketInstance;
  let socket = useRef(
    io("http://sharkbait-app.ml", { autoConnect: false })
  ).current;
  let firstConnection = useRef(true);
  const chats = useSelector((state) => state.chats.loaded);

  /*****************
  FRIEND FUNCTIONS
  *****************/
  const sendRequest = (user, friend) =>
    socket.emit("sendRequest", { user: user, friend: friend });

  const acceptRequest = (user, friend) => {
    socket.emit("acceptRequest", { user: user, friend: friend });
    dispatch(removeRequest(friend));
    dispatch(addFriend(friend));
  };

  const rejectRequest = (user, friend) => {
    socket.emit("rejectRequest", { user: user, friend: friend });
    dispatch(removeRequest(friend));
  };

  const unfriend = (user, friend) => {
    socket.emit("unfriend", { user: user, friend: friend });
    dispatch(removeFriend(friend));
  };

  /****************
  CHAT FUNCTIONS
  ****************/

  const joinChat = (chat_id) => {
    console.log("Joining chat", chat_id);
    socket.emit("joinChat", chat_id);

    if (!(chat_id in chats)) {
      console.log("Getting messages");

      socket.emit("getMessages", chat_id, (response) => {
        dispatch(loadChat({ id: chat_id, data: response }));
      });
    }
  };

  const leaveChat = (chat_id) => {
    console.log("Leaving chat", chat_id);
    socket.emit("leaveChat", chat_id);
  };

  const sendMessage = (message, members, from) => {
    console.log("Sending message", message.uid);
    socket.emit("sendMessage", { msg: message, to: members, from: from });
    dispatch(addMessage(message));

    if (!userChats || !(message.chat_id in userChats))
      dispatch(createChat({ msg: message, members: members }));
    else dispatch(updateChat(message));
  };

  const sendTyping = (data) => {
    socket.emit("typing", data);
  };

  /****************
  SOCKET INIT
  ****************/

  if (!isLoggedIn && socket.connected) {
    socket.close();
  }

  if (isLoggedIn && !socket.connected) {
    socket.connect();

    socket.emit("userConnection", user.uid);
  }

  if (firstConnection.current) {
    firstConnection.current = false;
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("disconnect", () => {
      console.log(socket.id);
    });

    /*****************
    FRIEND LISTENERS
    *****************/
    socket.on("newRequest", (friend) => {
      dispatch(addRequest(friend));
    });

    socket.on("newFriend", (friend) => {
      dispatch(addFriend(friend));
    });

    socket.on("unfriend", (friend) => {
      dispatch(removeFriend(friend));
    });

    /*****************
    MESSAGE LISTENERS
    *****************/
    socket.on("newMessage", (data) => {
      console.log("new message for", data.members[0]);
      dispatch(addMessage(data.msg));

      if (!userChats || !(data.msg.chat_id in userChats))
        dispatch(createChat({ msg: data.msg, members: data.members }));
      else dispatch(updateChat(data.msg));
    });
  }

  if (isLoggedIn) {
    socketInstance = {
      socket: socket,
      sendRequest,
      acceptRequest,
      rejectRequest,
      unfriend,
      joinChat,
      leaveChat,
      sendMessage,
      sendTyping,
    };
  }

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
