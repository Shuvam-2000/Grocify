import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setCart } from "../../../store/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [address, setAddress] = useState({
    fullName: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.offerPrice * item.quantity,
    0
  );

  // handle form inputs
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      // validate address
      if (Object.values(address).some((v) => !v)) {
        toast.error("Please fill in all address fields");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      // 1️⃣ Create Razorpay Order
      const { data } = await axios.post(
        "/api/user/place-order",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data?.razorpayOrderId) {
        toast.error("Failed to create Razorpay order");
        return;
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY, // from .env
        amount: data.amount,
        currency: data.currency,
        name: "Grocery Store",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }

          try {
            // Verify Payment
            const verifyRes = await axios.post(
              "/api/user/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              // Create Order
              await axios.post(
                "/api/user/create-order",
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  deliveryAddress: address,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              // Clear cart in frontend
              dispatch(setCart([]));
              toast.success("Order placed successfully!");
              navigate("/orders");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error(
              err?.response?.data?.message || "Error verifying payment"
            );
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-8 bg-gray-50">
      {/* LEFT: Delivery Address Form */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <form className="space-y-6">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="addressLine"
            placeholder="Street Address"
            value={address.addressLine}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="postalCode"
            placeholder=""
            value={address.postalCode}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={address.country}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </form>
      </div>

      {/* RIGHT: Order Summary */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p className="text-gray-600 mb-4">
          Total Price: <span className="font-bold text-lg">₹{totalPrice}</span>
        </p>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-xl font-semibold transition cursor-pointer"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
