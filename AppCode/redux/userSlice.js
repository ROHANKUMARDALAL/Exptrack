import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  token: '',
  user: null,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Login ke baad call hoga
    setUser(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    // Sirf user update karna ho
    updateUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    // Logout
    logout(state) {
      state.isLoggedIn = false;
      state.token = '';
      state.user = null;
    },
  },
});

export const {
  setUser,
  updateUser,
  logout,
} = userSlice.actions;

export default userSlice.reducer;