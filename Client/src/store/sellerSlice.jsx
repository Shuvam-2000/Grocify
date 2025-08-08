import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,
    sellerProduct: [],
  },
  reducers: {
    setSeller: (state, action) => {
      state.seller = action.payload;
    },
    logout: (state) => {
      state.seller = null;
      state.sellerProduct = [];
    },
    setSellerProduct: (state, action) => {
      state.sellerProduct = action.payload;
    },
  },
});

export const { setSeller, logout, setSellerProduct } = sellerSlice.actions;
export default sellerSlice.reducer;
