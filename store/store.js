import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer.js';
import chatsReducer from './chatsReducer.js';

export default configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer,
  }
})