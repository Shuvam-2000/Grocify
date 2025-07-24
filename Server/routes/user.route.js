import express from 'express';
import { newUserRegister, userLogin } from '../controllers/user.controller.js';

// initlailize router
const router = express.Router();

// new user register route
router.post('/register', newUserRegister);

// user login route
router.post('/login', userLogin);

export default router;