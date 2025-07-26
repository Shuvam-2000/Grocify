import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product', 
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      }
    ],
    orders: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'order',
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
