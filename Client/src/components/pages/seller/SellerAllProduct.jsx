import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setSellerProduct } from "../../../store/sellerSlice";
import { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";

const SellerAllProduct = () => {
  const seller = useSelector((store) => store.seller?.seller);
  const sellerProduct = useSelector((store) => store.seller?.sellerProduct);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProductCreated = async () => {
    try {
      const token = localStorage.getItem("sellertoken");
      if (!token) return;
      const res = await axios.get("/api/seller/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.products?.length === 0) {
        setErrorMessage("No Products Found");
      } else {
        dispatch(setSellerProduct(res.data.products));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error Fetching Products For Seller"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sellertoken");
    dispatch(logout());
    navigate("/seller");
  };

  useEffect(() => {
    fetchProductCreated();
  }, []);

  const handleToggleStock = async (productId, currentStockStatus) => {
    try {
      const token = localStorage.getItem("sellertoken");
      if (!token) return;

      await axios.patch(
        "/api/product/update",
        {
          id: productId,
          inStock: !currentStockStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update Redux with new stock status
      const updatedProducts = sellerProduct.map((product) =>
        product._id === productId
          ? { ...product, inStock: !currentStockStatus }
          : product
      );

      dispatch(setSellerProduct(updatedProducts));
      fetchProductCreated();
      toast.success("Stock status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update stock status"
      );
    }
  };

  const handleDelete = (id) => {
    console.log("Deleted product:", id);
  };

  return (
    <>
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

      <div className="p-4 w-full max-w-8xl mx-auto mt-4">
        {sellerProduct?.length > 0 ? (
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full table-auto bg-white text-sm">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Offer Price</th>
                  <th className="px-4 py-3 text-left">In Stock</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sellerProduct.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover border"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">₹{product.price}</td>
                    <td className="px-4 py-3 text-green-600">
                      ₹{product.offerPrice}
                    </td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={() =>
                            handleToggleStock(product._id, product.inStock)
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${
                            product.inStock ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                              product.inStock ? "translate-x-5" : ""
                            }`}
                          />
                        </div>
                      </label>
                    </td>

                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm mt-6">
            {errorMessage || "Loading products..."}
          </p>
        )}
      </div>
    </>
  );
};

export default SellerAllProduct;
