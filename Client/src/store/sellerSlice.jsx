import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,
  },
  reducers: {
    setSeller: (state, action) => {
      state.seller = action.payload;  
    },
    logout: (state) => {
      state.seller = null;            
    },
  },
});

export const { setSeller, logout } = sellerSlice.actions;
export default sellerSlice.reducer;
