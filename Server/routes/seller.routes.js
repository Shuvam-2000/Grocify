import express from 'express';
import { sellerLogin } from '../controllers/seller.controller.js';

// initlaize the router
const router = express.Router();

// seller login route
router.post("/seller-login", sellerLogin)

export default router;