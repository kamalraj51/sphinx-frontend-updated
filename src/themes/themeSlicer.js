import { createSlice } from "@reduxjs/toolkit";
import { appTheme } from "./appTheme";


const themeslice=createSlice({
    name:'theme',
    initialState:{theme:appTheme},
    reducers:{},
});
export default themeslice.reducer;