import express from "express";
import {
  addToCart,
  createOrder,
  decreaseItemQuantity,
  deleteCartItems,
  getItemsInCart,
  getUserInfo,
  increaseItemQuantity,
  newUserRegister,
  placeOrder,
  userLogin,
  verifyPayment,
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

// route for deleting all the items in the cart
router.delete("/delete-cart", isUserAuthenticated, deleteCartItems);

// route for increasing quantity of item in cart
router.patch("/increase", isUserAuthenticated, increaseItemQuantity);

// route for decreasing quantity of item in cart
router.patch("/decrease", isUserAuthenticated, decreaseItemQuantity);

// route for placing order 
router.post('/place-order', isUserAuthenticated, placeOrder);

// route for verifying the payment
router.post('/verify-payment', isUserAuthenticated, verifyPayment);

// route for saving the order to the database
router.post('/create-order', isUserAuthenticated, createOrder);

export default router;
