import Seller from "../models/seller.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import Product from "../models/product.model.js";

configDotenv();

// seller registration
export const sellerRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if all fields are provided
    if (!name || !email || !password)
      return res.status(400).json({
        message: "All Fields Are Required",
        success: false,
      });

    // check if seller already registered
    const sellerAlreadyRegistered = await Seller.findOne({ email });
    if (sellerAlreadyRegistered)
      return res.status(400).json({
        message: "Seller is Already Registered",
        success: false,
      });

    // hashing the passoword
    const hashedPassword = await bcrypt.hash(password, 10);

    // register new seller
    const newSeller = await Seller.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "seller Registered Successfully",
      success: true,
      seller: newSeller,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// seller login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({
        message: "Seller Not Found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        sellerId: seller._id,
        name: seller.name,
        email: seller.email,
        role: "seller",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login Successful",
      success: true,
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get seller Info
export const getSellerInfo = async (req, res) => {
  try {
    // fetching sellerId from the middleware
    const sellerId = req.user.sellerId;

    if (!sellerId)
      return res.status(400).json({
        message: "Seller ID not Found",
        success: false,
      });

    // fetch the selleInfo
    const sellerInfo = await Seller.findById(sellerId).select("-password");

    if (!sellerInfo)
      return res.status(404).json({
        message: "Seller Not Avaliable",
        success: false,
      });

    res.status(200).json({
      message: "User Found",
      success: true,
      seller: sellerInfo,
    });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get products added by the seller
export const getProductsAdded = async (req, res) => {
  try {
    // fetching sellerId from the middleware
    const sellerId = req.user?.sellerId;
    
    // check if seller Id present
    if(!sellerId) return res.status(404).json({
      message: 'Seller Id Not Found',
      success: false
    })
    
    // fecthing the product data
    const fetchAddedproduct = await Product.find({ seller: sellerId })

    res.status(200).json({
      message: 'Products Fetched SuccessFully',
      success: true,
      products: fetchAddedproduct
    })
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
