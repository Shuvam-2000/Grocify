import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
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
    },
    password: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product", 
      }
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order", 
      }
    ]
  },
  { timestamps: true }
);

const Seller = mongoose.model("seller", sellerSchema);

export default Seller;
