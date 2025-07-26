import express from "express";
import {
  getProductsAdded,
  getSellerInfo,
  sellerLogin,
  sellerRegistration,
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

export default router;
