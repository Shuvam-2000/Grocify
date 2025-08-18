import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setSellerOrder } from "../../../store/sellerSlice";
import { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";

const shippingStatusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const SellerOrder = () => {
  const seller = useSelector((store) => store.seller?.seller);
  const sellerOrders = useSelector((store) => store.seller?.sellerOrders) || [];
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // fetching the orders info for the seller
  const fetchSellerOrders = async () => {
    try {
      const sellertoken = localStorage.getItem("sellertoken");
      if (!sellertoken) return;

      const res = await axios.get("/api/seller/get-orders", {
        headers: { Authorization: `Bearer ${sellertoken}` },
      });
      dispatch(setSellerOrder(res.data?.orders || []));
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Error Fetching Orders"
      );
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sellertoken");
    dispatch(logout());
    navigate("/seller");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const sellertoken = localStorage.getItem("sellertoken");

      if(!sellertoken) return ;

      await axios.patch(
        "/api/seller/update-status",
        {
          id: orderId, // send orderId in body
          shippingStatus: newStatus, // send shippingStatus in body
        },
        {
          headers: { Authorization: `Bearer ${sellertoken}` },
        }
      );

      // update UI locally
      const updatedOrders = sellerOrders.map((order) =>
        order._id === orderId ? { ...order, shippingStatus: newStatus } : order
      );
      dispatch(setSellerOrder(updatedOrders));

      toast.success("Shipping status updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-4 sm:px-8 border-b border-gray-300 bg-white">
        <h1
          onClick={() => navigate("/seller/dashboard")}
          className="sm:text-3xl text-2xl font-extrabold text-black cursor-pointer"
        >
          Hi,{" "}
          <span className="text-green-700">
            {seller?.name ? seller.name : "Seller"}
          </span>
        </h1>

        <button
          onClick={handleLogout}
          className="hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm bg-green-700 transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Orders Table */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Orders</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {sellerOrders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Buyer
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Total
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Payment
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Shipping Status
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-sm text-gray-700 flex items-center gap-2">
                      <img
                        src={order.products[0].product.image[0]}
                        alt={order.products[0].product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium">
                          {order.products[0].product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {order.products[0].quantity}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {order.deliveryAddress.fullName} <br />
                      <span className="text-xs text-gray-500">
                        {order.deliveryAddress.city},{" "}
                        {order.deliveryAddress.state}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-semibold text-gray-800">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <select
                        value={order.shippingStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-md text-xs font-medium cursor-pointer border-0 focus:ring-2 focus:ring-green-400 ${
                          shippingStatusColors[order.shippingStatus]
                        }`}
                      >
                        {["Pending", "Shipped", "Delivered", "Cancelled"].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerOrder;
