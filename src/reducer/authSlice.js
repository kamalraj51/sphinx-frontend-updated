
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('userLoginId'),
  user: localStorage.getItem('userLoginId') || null,
  role:localStorage.getItem("role")||null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
  const { userLoginId, role } = action.payload;

  state.isAuthenticated = true;
  state.user = userLoginId;
  state.role = role;

  localStorage.setItem("userLoginId", userLoginId);
  localStorage.setItem("role", role);
},
    logout: (state) => {
  state.isAuthenticated = false;
  state.user = null;
  state.role = null;

  localStorage.removeItem("userLoginId");
  localStorage.removeItem("role"); // 
}
    
  },
});

export const { login, logout,setRole } = authSlice.actions;
export default authSlice.reducer;