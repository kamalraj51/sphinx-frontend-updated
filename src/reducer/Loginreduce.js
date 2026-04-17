import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("login")) || false,
  userLoginId: JSON.parse(localStorage.getItem("userLoginId")) || null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = action.payload;
      localStorage.setItem("login", JSON.stringify(action.payload));
    },

    setLoginId: (state, action) => {
      state.userLoginId = action.payload;
      localStorage.setItem("userLoginId", JSON.stringify(action.payload));
    },
  },
});

export const { setLogin, setLoginId } = loginSlice.actions;

export default loginSlice.reducer;