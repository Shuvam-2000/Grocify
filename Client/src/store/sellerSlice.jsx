import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,
    sellerProduct: [],
    sellerOrders: [],
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
    setSellerOrder: (state, action) => {
      state.sellerOrders = action.payload;
    },
  },
});

export const { setSeller, logout, setSellerProduct, setSellerOrder } =
  sellerSlice.actions;
export default sellerSlice.reducer;
