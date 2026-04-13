
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('userLoginId'),
  user: localStorage.getItem('userLoginId') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.userLoginId;
      localStorage.setItem('userLoginId', action.payload.userLoginId);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('userLoginId');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;