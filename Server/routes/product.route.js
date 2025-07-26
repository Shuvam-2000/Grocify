import express from "express";
import {
  addNewProduct,
  changeProductInStock,
  fetchProductList,
} from "../controllers/product.controller.js";
import { isSellerAuthenticated } from "../middlewares/seller.middleware.js";
import { upload } from "../config/multer.js";
import { isUserAuthenticated } from "../middlewares/user.middlware.js";

// initlaize the router
const router = express.Router();

// route for add new product
router.post("/add", isSellerAuthenticated, upload, addNewProduct);

// route for fetching all the products
router.get("/get-product", fetchProductList);

// route for fetching product info with the id
router.get("/get-product/:id", isUserAuthenticated, fetchProductList);

// route for updating the instock status for a product
router.patch("/update", isSellerAuthenticated, changeProductInStock)

export default router;
