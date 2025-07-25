import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export const isUserAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided or bad format",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return res.status(403).json({
        message: "Unauthorized: Not a seller",
        success: false,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Middleware Error:", error.message);
    res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
