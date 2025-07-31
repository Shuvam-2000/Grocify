import Razorpay from "razorpay";
import { configDotenv } from "dotenv";

configDotenv();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
    //  headers: process.env.RAZORPAY_ACCOUNT_ID
    // ? { "X-Razorpay-Account": process.env.RAZORPAY_ACCOUNT_ID }
    // : undefined,
})

// instance.orders.all().then(console.log).catch(console.error);