import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    allproducts: [],
    singleproduct: null
  },
  reducers: {
    setAllProducts: (state, action) => {
      state.allproducts = action.payload;
    },
    setSingleProduct: (state, action) => {
      state.singleproduct = action.payload 
    }
  }
});

export const { setAllProducts, setSingleProduct } = productSlice.actions;
export default productSlice.reducer;
