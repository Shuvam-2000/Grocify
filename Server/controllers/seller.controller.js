import Seller from "../models/seller.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

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

// get order info for seller
export const getOrderInfoForSeller = async (req,res) => {
  try {
    // fetching sellerId from the middleware
    const sellerId = req.user.sellerId;

    if (!sellerId)
      return res.status(400).json({
        message: "Seller ID not Found",
        success: false,
      });

      // fetch order info for seller
      const seller = await Seller.findById(sellerId)
      .populate({
        path: "orders", // populate orders array
        populate: {
          path: "products.product", // populate each product inside order
          model: "product",
        },
      }); 

      if(!seller) return res.status(404).json({
        message: "Seller Not Found",
        success: false
      })

      return res.status(200).json({
        message: "Orders Fetched Successfully",
        success: true,
        orders: seller.orders
      })

  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// update shipping status for the order
export const updateShippingStatus = async (req, res) => {
  try {
    const { id, shippingStatus } = req.body;
    const sellerId = req.user?.sellerId; // from middleware

    if (!id || !shippingStatus) {
      return res.status(400).json({ 
        message: "Order ID and status are required",
        success: false
      });
    }

    // Validate status
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(shippingStatus)) {
      return res.status(400).json({ 
        message: "Invalid shipping status",
        success: false 
      });
    }

    // Check if this seller has the product in this order
    const order = await Order.findById(id).populate("products.product");
    if (!order) return res.status(404).json({ 
      message: "Order not found",
      success: false 
    });

    const sellerHasProduct = order.products.some(p => p.product.seller.toString() === sellerId);
    if (!sellerHasProduct) {
      return res.status(403).json({ 
        message: "You cannot update this order",
        success: false 
      });
    }

    // Update status
    order.shippingStatus = shippingStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Shipping status updated",
      order
    });
  } catch (error) {
    console.error("Update Shipping Status Error:", error.message);
    return res.status(500).json({ 
      message: "Internal Server Error",
      success: false 
    });
  }
};