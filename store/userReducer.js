import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* Keeps track of all logged in user information */

export const login = createAsyncThunk("user/login", async (user) => {
  return fetch("http://api.sharkbait-app.ml/verify", {
    method: "POST",
    body: JSON.stringify({ uid: user.uid, password: user.password }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
});

const initialState = {
  data: null,
  friends: null,
  requests: null,
  sent: null,
  interests: null,
  chats: null,
  valid: null,
  status: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout: () => initialState,

    //FRIENDS
    addRequest: (state, { payload }) => {
      if (!state.requests) state.requests = [payload];
      else {
        state.requests = state.requests
          .filter((req) => req.uid != payload.uid)
          .concat([payload]);
      }
    },

    removeRequest: (state, { payload }) => {
      if (state.requests) {
        state.requests = state.requests.filter((req) => req.uid != payload.uid);
        if (state.requests.length == 0) state.requests = null;
      }
    },

    addFriend: (state, { payload }) => {
      if (!state.friends) state.friends = [payload];
      else
        state.friends = state.friends
          .filter((req) => req.uid != payload.uid)
          .concat([payload]);
    },

    removeFriend: (state, { payload }) => {
      if (state.friends) {
        state.friends = state.friends.filter((req) => req.uid != payload.uid);
        if (state.friends.length == 0) state.friends = null;
      }
    },

    //INTERESTS
    addInterest: (state, { payload }) => {
      fetch("http://api.sharkbait-app.ml/interests/add", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const title = payload.interest;

      if (!state.interests) state.interests = [title];
      else
        state.interests = state.interests
          .filter((interest) => interest != title)
          .concat([title]);
    },

    removeInterest: (state, { payload }) => {
      fetch("http://api.sharkbait-app.ml/interests/remove", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const title = payload.interest;

      state.interests = state.interests.filter((interest) => interest != title);
      if (state.interests.length == 0) state.interests = null;
    },

    //CHATS
    createChat: (state, { payload }) => {
      let id = payload.msg.chat_id;

      const now = Date.now();

      if (!state.chats) state.chats = {}

      state.chats[id] = {
        ...payload.msg,
        ...{members: payload.members},
        ...{last_update: now}
      }
    },

    updateChat: (state, { payload }) => {
      let chat = payload;

      if (state.chats[payload.chat_id]) {
        const now = Date.now();

        state.chats[payload.chat_id] = {
          ...state.chats[payload.chat_id],
          ...chat,
          ...{last_update: now}
        };
      }
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.status = "loading";
      state.valid = null;
    },
    [login.fulfilled]: (state, { payload }) => {
      if (payload.valid !== undefined) {
        state.valid = payload.valid;
        delete payload.valid;
      }

      if (payload.data) {
        const data = payload.data;

        if (data.friends !== undefined) {
          state.friends = data.friends;
          delete data.friends;
        }

        if (data.requests !== undefined) {
          state.requests = data.requests;
          delete data.requests;
        }

        if (data.sent !== undefined) {
          state.sent = data.sent;
          delete data.sent;
        }

        if (data.interests !== undefined) {
          state.interests = data.interests;
          delete data.interests;
        }

        if (data.chats !== undefined) {
          state.chats = data.chats;
          delete data.chats;
        }

        state.data = data;
      }

      state.status = "success";
    },
    [login.rejected]: (state, action) => {
      state.status = "rejected";
    },
  },
});

export const {
  logout,
  addRequest,
  removeRequest,
  addFriend,
  removeFriend,
  addInterest,
  removeInterest,
  createChat,
  updateChat,
} = userSlice.actions;
export default userSlice.reducer;
