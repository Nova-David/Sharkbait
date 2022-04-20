import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer.js';

export default configureStore({
  reducer: {
    user: userReducer
  }
})