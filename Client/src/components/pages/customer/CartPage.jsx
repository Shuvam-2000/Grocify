import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { setCart } from "../../../store/cartSlice";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [totalPrice, setTotalPrice] = useState(0);

  const getCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/api/user/get-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setCart(res.data?.cartItems));
      setTotalPrice(res.data?.totalPrice || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching cart");
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/user/clear-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setCart([]));
      setTotalPrice(0);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart", error);
    }
  };

  const updateQuantity = async (productId, type) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/user/update-cart",
        { productId, type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getCartItems(); 
    } catch (error) {
      toast.error("Failed to update cart", error);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="sm:text-3xl text-xl font-semibold mb-6">🛒 Your Cart—</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between border rounded-lg p-4 gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full sm:w-[60%]">
                  <img
                    src={item.product.image[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">₹{item.product.offerPrice} each</p>
                    <p className="text-gray-400 text-sm">
                      Total: ₹{item.product.offerPrice * item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product._id, "decrease")}
                    className="p-1 border rounded bg-red-500 text-white cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, "increase")}
                    className="p-1 border rounded bg-blue-500 text-white cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total Price & Place Order */}
          <div className="mt-10 border-t pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                🧾 Total Price: ₹{totalPrice}
              </h3>

              <div className="flex gap-4 mt-4 sm:mt-0">
                <button
                  onClick={clearCart}
                  className="bg-red-600 text-white px-2 py-2 sm:px-5 sm:py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Clear Cart
                </button>

                <button
                  onClick={() => toast.success("Proceeding to payment...")}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  🛍️ Place Order
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
