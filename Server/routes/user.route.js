import express from "express";
import {
  addToCart,
  deleteCartItems,
  getItemsInCart,
  getUserInfo,
  newUserRegister,
  userLogin,
} from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/user.middlware.js";

// initlailize router
const router = express.Router();

// new user register route
router.post("/register", newUserRegister);

// user login route
router.post("/login", userLogin);

// get user Info route
router.get("/get", isUserAuthenticated, getUserInfo);

// route for adding items to cart
router.post("/add", isUserAuthenticated, addToCart);

// route for fetching the items in cart
router.get("/get-cart", isUserAuthenticated, getItemsInCart)

// route for deletign all the items in the cart
router.delete("/delete-cart", isUserAuthenticated, deleteCartItems);

export default router;
