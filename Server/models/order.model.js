import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    shippingStatus: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },

    deliveryAddress: {
      fullName: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true }
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;
