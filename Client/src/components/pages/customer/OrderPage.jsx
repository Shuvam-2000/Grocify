import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../utils/axios";
import { setUserOrder } from "../../../store/userSlice";
import { Package, MapPin, CreditCard } from "lucide-react";

const OrderPage = () => {
  const dispatch = useDispatch();
  const userOrderedItems = useSelector((state) => state.user.userOrderedItems);
  const [errorMessage, setErrorMessage] = useState("");

  const getOrdersForUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/api/user/fetch-order", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setUserOrder(res.data?.orders || []));
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Error Fetching Orders"
      );
    }
  };

  useEffect(() => {
    getOrdersForUser();
  }, []);

  // Status colors mapping
  const shippingStatusColors = {
    Pending: "bg-yellow-100 text-yellow-600",
    Shipped: "bg-blue-100 text-blue-600",
    Delivered: "bg-green-100 text-green-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  const paymentStatusColors = {
    paid: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    failed: "bg-red-100 text-red-600",
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}

      {userOrderedItems.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow border">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            {/* Table Head */}
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Products</th>
                <th className="px-6 py-3 text-left font-semibold">Address</th>
                <th className="px-6 py-3 text-left font-semibold">Payment</th>
                <th className="px-6 py-3 text-left font-semibold">Shipping</th>
                <th className="px-6 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {userOrderedItems.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition">
                  {/* Date */}
                  <td className="px-6 py-4 text-gray-600">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Products */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {order.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {product.quantity} | ₹
                              {product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4 text-gray-600 text-sm max-w-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                      <span>
                        {order.deliveryAddress?.addressLine},{" "}
                        {order.deliveryAddress?.city},{" "}
                        {order.deliveryAddress?.state},{" "}
                        {order.deliveryAddress?.postalCode}
                      </span>
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        paymentStatusColors[order.paymentStatus] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Shipping Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        shippingStatusColors[order.shippingStatus] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.shippingStatus}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 text-right font-semibold text-gray-800">
                    ₹{order.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
