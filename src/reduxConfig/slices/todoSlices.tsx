//@todo this is first step where we creating reducer:-
//in Redux toolkit we create slices
//reducer & action creater are created by this slice func createSlice

import {  createSlice } from "@reduxjs/toolkit";

interface TodoState {
  userData: Record<string, any>; // Adjust the type based on the actual structure of userData
  redirect: any;
}

//initial value
const initalValue: TodoState = {
  userData: {},
  redirect: -1,
};

const todoSlice = createSlice({
  name: "todo",
  initialState: initalValue,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload.tokenData;
    },
    toggleRedirect: (state, action) => {
      state.redirect = action.payload;
    },
  },
});

//setUserData is a action
export const { setUserData, toggleRedirect } = todoSlice.actions;
// todoSlice.reducer act as a reference for the store that accept change if and only it comes from reducer
// of slice named todoSlice;
export default todoSlice.reducer;
