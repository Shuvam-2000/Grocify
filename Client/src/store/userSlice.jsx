import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userOrderedItems: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setUserOrder: (state, action) => {
      state.userOrderedItems = action.payload;
    },
  }
});

export const { setUser, logout, setUserOrder } = userSlice.actions;
export default userSlice.reducer;