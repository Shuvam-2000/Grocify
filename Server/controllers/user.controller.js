import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";

// load environment variables
configDotenv();

// new user registration
export const newUserRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if all fields are provided
    if (!name || !email || !password)
      return res.status(400).json({
        message: "All Fields Are Required",
        success: false,
      });

    // check if user already exists
    const exisitingUser = await User.findOne({ email });
    if (exisitingUser)
      return res.status(400).json({
        message: "User Already Exists",
        success: false,
      });

    // hashing the passoword
    const hashedPassword = await bcrypt.hash(password, 10);

    // register new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// user login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login Successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get user info
export const getUserInfo = async (req, res) => {
  try {
    // fetching userId from the middleware
    const userId = req.user.userId;

    if (!userId)
      return res.status(400).json({
        message: "User ID not Found",
        success: false,
      });

    // fetch the user
    const user = await User.findById(userId).select("-password");

    if (!user)
      return res.status(404).json({
        message: "User Not Avaliable",
        success: false,
      });

    res.status(200).json({
      message: "User Found",
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// add a product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.userId;

    // fetch productId and qauntity from the frontend
    const { productId, quantity } = req.body;

    // check if user Id exists
    if (!productId || !userId)
      return res.status(400).json({
        message: "User Id Not Found",
        success: false,
      });

    // check if the product exists
    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({
        message: "Product Not Found",
        success: false,
      });

    // check if the user exists
    const user = await User.findById(userId);

    // check if the product already exists in the cart
    const itemExisitInCart = user.cartItems.find(
      (items) => items.product.toString() === productId
    );

    if (itemExisitInCart) {
      itemExisitInCart.quantity += quantity || 1;
      if (itemExisitInCart.quantity > 10) {
        itemExisitInCart.quantity = 10;
        res.status(400).json({
            message: "Maxium quantity reached for this item",
            success: false
        })
      }
    } else {
      user.cartItems.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await user.save(); // save the data to the database

    res.status(200).json({
      message: "Product added to cart",
      success: true,
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get items in cart
export const getItemsInCart = async (req,res) => {
  try {
    const userId = req.user?.userId;

    if(!userId) return res.status(400).json({
      message: 'User Id not Found',
      success: false
    })

    // fetch cart data 
    const user = await User.findById(userId).populate("cartItems.product");

    if(!user) return res.status(404).json({
      message: 'User Not Found',
      success: false
    })

    res.status(200).json({
      message: 'Cart Items Fetched SuccessFully',
      success: true,
      cartItems: user.cartItems
    })
    
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// delete all items in cart
export const deleteCartItems = async (req,res) => {
  try {
    const userId = req.user?.userId;

    // check if userId present
    if(!userId) return res.status(404).json({
      message: 'User Id not Found',
      success: false
    })

    // delete all the items in cart
    await User.findByIdAndUpdate(userId, { cartItems: [] });

    res.status(200).json({
      message: "Cart Items Deleted SuccessFully",
      success: true
    })
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}