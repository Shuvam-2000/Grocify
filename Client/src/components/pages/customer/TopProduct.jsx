import axios from "../../../utils/axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../../../store/productSlice";
import { Link } from "react-router-dom";

const TopProduct = () => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(""); // error message
  const { allproducts } = useSelector((store) => store.product); // fetch product data from redux

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("/api/product/get-product");
        dispatch(setAllProducts(res.data.product));
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage(
          error?.response?.data?.message ||
            "No Best Selling Product At the Moment"
        );
      }
    };

    getProducts();
  }, [dispatch]);

  const bgColors = ["bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-pink-50"];

  return (
    <div className="text-center my-14 px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
        Our Top Products—
      </h2>
      <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
        Handpicked favorites just for you — quality, freshness, and unbeatable
        prices.
      </p>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {allproducts.slice(0, 5).map((product, index) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className={`rounded-2xl p-4 shadow hover:shadow-lg transition-all block ${
              bgColors[index % bgColors.length]
            }`}
          >
            <img
              src={product.image?.[0] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {product.description?.join(", ")}
            </p>
            <p className="text-green-600 font-bold mt-2">
              ₹{product.offerPrice || product.price}
            </p>
            <p className="text-blue-600 font-medium mt-1">{product.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopProduct;
