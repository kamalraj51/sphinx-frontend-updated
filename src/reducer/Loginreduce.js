const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("login")) || false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = action.payload;
      localStorage.setItem("login", JSON.stringify(action.payload));
    },
  },
});
export const { setLogin } = loginSlice.actions;
export default loginSlice.reducer;