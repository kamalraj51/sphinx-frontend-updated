import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../themes/themeSlicer"
import apiSlice from "./apiReduce";
import authReducer from "./authSlice";


const store=configureStore({
    reducer:{
        theme:themeSlice,
        api:apiSlice,
        auth:authReducer,
        
        
    },
})
export default store;