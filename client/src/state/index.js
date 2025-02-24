import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  themes: [], 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
      state.themes = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("Attempted to set friends, but no user is logged in.");
      }
    },
    setPosts: (state, action) => {
      state.posts = Array.isArray(action.payload.posts) ? action.payload.posts : [];
    },
    setPost: (state, action) => {
      const updatedPost = action.payload.post;
    
      // Find the index of the post in the state
      const postIndex = state.posts.findIndex((post) => post._id === updatedPost._id);
    
      if (postIndex !== -1) {
        // Update existing post and trigger state change
        state.posts[postIndex] = { ...updatedPost };
      } else {
        // If post is missing, add it
        state.posts = [...state.posts, updatedPost];
      }
    }
    ,
    setThemes: (state, action) => {
      state.themes = action.payload.themes; 
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setThemes, 
} = authSlice.actions;

export default authSlice.reducer;
