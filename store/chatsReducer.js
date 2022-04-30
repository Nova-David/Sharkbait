import { createSlice } from "@reduxjs/toolkit";

/* Keeps track of all the chats and messages */

const initialState = {
  loaded: {}
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState: initialState,
  reducers: {
    eraseChats: () => initialState,

    loadChat: (state, { payload }) => {
      state[payload.id] = payload.data;
      state.loaded[payload.id] = true;
    },

    addMessage: (state, { payload }) => {
      if (!state[payload.chat_id]) state[payload.chat_id] = [payload];
      else state[payload.chat_id].push(payload);
    }
  },
  extraReducers: {
   
  },
});

export const {
  eraseChats,
  loadChat,
  addMessage
} = chatsSlice.actions;
export default chatsSlice.reducer;
