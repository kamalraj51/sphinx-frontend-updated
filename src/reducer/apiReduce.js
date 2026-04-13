import { createSlice } from "@reduxjs/toolkit";


const apiSlice=createSlice({
    name:"api",
    initialState: {value:false},
    reducers:{
        toggle:(state)=>{
            state.value=!state.value;
        },
    }
})
export const {toggle}=apiSlice.actions;
export default apiSlice.reducer;