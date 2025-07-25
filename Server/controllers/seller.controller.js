import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.SELLER_EMAIL ||
      password !== process.env.SELLER_PASSWORD
    ) {
      return res.status(400).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }

    const token = jwt.sign(
      { email, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login Successful",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
