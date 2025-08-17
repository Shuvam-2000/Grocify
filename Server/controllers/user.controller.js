import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Seller from "../models/seller.model.js"
import Order from "../models/order.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import { instance } from "../config/payment.js";
import crypto from 'crypto';

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
          success: false,
        });
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
export const getItemsInCart = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID not found",
        success: false,
      });
    }

    // Fetch user and populate cart items
    const user = await User.findById(userId).populate("cartItems.product");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Calculate total price from cart items
    const totalPrice = user.cartItems.reduce((acc, item) => {
      const product = item.product;
      const quantity = item.quantity || 1;

      if (product && product.offerPrice) {
        return acc + product.offerPrice * quantity;
      }
      return acc;
    }, 0);

    res.status(200).json({
      message: "Cart items fetched successfully",
      success: true,
      cartItems: user.cartItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// increase quantity of any item in cart
export const increaseItemQuantity = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    // check if userId and productId present
    if (!userId || !productId)
      return res.status(400).json({
        message: "User ID and Product ID are required",
        success: false,
      });

    // fetch user from the userId
    const user = await User.findById(userId);

    // fetch the products info in the cart with the productId
    const cartItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    // check cart item quanitity is less than 10
    if (cartItem.quantity >= 10) {
      return res.status(400).json({
        message: "Maximum quantity reached",
        success: false,
      });
    }

    // increment the quantity of a item in cart
    cartItem.quantity += 1;

    await user.save();

    res.status(200).json({
      message: "Product Quantity increased",
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

// decrease quantity of any product in cart
export const decreaseItemQuantity = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    // check if productId and userId present
    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and Product ID are required",
        success: false,
      });
    }

    // fetch user with the userId
    const user = await User.findById(userId);

    // fetch the index of the item in the cart with the product ID
    const cartItemIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    // check if item is present in the cart
    if (cartItemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    if (user.cartItems[cartItemIndex].quantity <= 1) {
      // Remove item if quantity reaches 0 or 1
      user.cartItems.splice(cartItemIndex, 1);
    } else {
      user.cartItems[cartItemIndex].quantity -= 1;
    }

    // update the database
    await user.save();

    res.status(200).json({
      message: "Product Quantity updated",
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

// delete all items in cart
export const deleteCartItems = async (req, res) => {
  try {
    const userId = req.user?.userId;

    // check if userId present
    if (!userId)
      return res.status(404).json({
        message: "User Id not Found",
        success: false,
      });

    // delete all the items in cart
    await User.findByIdAndUpdate(userId, { cartItems: [] });

    res.status(200).json({
      message: "Cart Items Deleted SuccessFully",
      success: true,
    });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// placeorder with the items in cart
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).populate('cartItems.product');

    if (!user || user.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty or user not found" });
    }

    const totalPrice = user.cartItems.reduce((acc, item) => {
      return acc + item.product.offerPrice * item.quantity;
    }, 0);

    if (totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const razorpayOrder = await instance.orders.create({
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    });

    return res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (error) {
    console.error("Place Order Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    return res.status(200).json({ success: true, message: 'Payment verified successfully' });

  } catch (error) {
    console.error("Verify Payment Error:", error.message);
     console.error(error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, deliveryAddress } = req.body;

    // Validate payment details
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing Razorpay payment details" });
    }

    // Validate delivery address
    if (!deliveryAddress || Object.values(deliveryAddress).some(field => !field)) {
      return res.status(400).json({ message: "Incomplete delivery address" });
    }

    // Get user with cart items populated
    const user = await User.findById(userId).populate('cartItems.product');

    if (!user || user.cartItems.length === 0) {
      return res.status(400).json({ message: "User not found or cart is empty" });
    }

    // Prepare order items
    const orderItems = user.cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));

    // Calculate total price
    const totalPrice = user.cartItems.reduce(
      (acc, item) => acc + item.product.offerPrice * item.quantity,
      0
    );

    // Create new order
    const newOrder = new Order({
      user: userId,
      products: orderItems,
      totalPrice,
      deliveryAddress,
      paymentStatus: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    await newOrder.save();

    // Update user orders
    const userOrders = orderItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    user.orders.push(...userOrders);

    // Clear user's cart
    user.cartItems = [];
    await user.save();

    // Add order reference to respective sellers
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product?.seller) {
        const seller = await Seller.findById(product.seller);
        if (seller) {
          seller.orders.push(newOrder._id); // Only push order _id
          await seller.save();
        }
      }
    }

    return res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error("Create Order Error:", error.message);
    console.error(error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// get ordered items for user
export const getOrderedItems = async (req,res) => {
  try {
    
  } catch (error) {
      console.error("Get Order Error:", error.message);
      return res.status(500).json({ 
      message: "Internal Server Error",
      success: false 
    });
  }
}