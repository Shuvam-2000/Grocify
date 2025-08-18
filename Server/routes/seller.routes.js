import express from "express";
import {
  getOrderInfoForSeller,
  getProductsAdded,
  getSellerInfo,
  sellerLogin,
  sellerRegistration,
  updateShippingStatus,
} from "../controllers/seller.controller.js";
import { isSellerAuthenticated } from "../middlewares/seller.middleware.js";

// initlaize the router
const router = express.Router();

// new seller registration
router.post("/seller-register", sellerRegistration);

// seller login route
router.post("/seller-login", sellerLogin);

// get seller info(name & email)
router.get("/seller-info", isSellerAuthenticated, getSellerInfo);

// route for fetching the product data for the seller
router.get("/my-products", isSellerAuthenticated, getProductsAdded);

// route for fetching the orders info for the sellers
router.get("/get-orders", isSellerAuthenticated, getOrderInfoForSeller);

// route for updating shipping status
router.patch("/update-status", isSellerAuthenticated, updateShippingStatus);

export default router;
