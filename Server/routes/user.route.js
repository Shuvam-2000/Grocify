import express from "express";
import {
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

export default router;
