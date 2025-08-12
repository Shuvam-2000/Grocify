import axios from "../../../utils/axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../../../store/productSlice";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const AllProducts = () => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { allproducts } = useSelector((store) => store.product);

  useEffect(() => {
    if (allproducts.length === 0) {
      const getProducts = async () => {
        try {
          const res = await axios.get("/api/product/get-product");
          dispatch(setAllProducts(res.data.product));
        } catch (error) {
          console.error("Error fetching products:", error);
          setErrorMessage(
            error?.response?.data?.message ||
              "Unable to fetch products at the moment"
          );
        }
      };

      getProducts();
    }
  }, [dispatch, allproducts.length]);

  // wait before sending API request
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]); // reset if empty
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // AI smart search API integration
  const handleSearch = async (query) => {
    try {
      const res = await axios.get(`/api/product/search?q=${query}`);
      setSearchResults(res.data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  // if product seaarch show searched product if not show all products
  const displayedProducts = searchResults.length > 0 ? searchResults : allproducts;
  const bgColors = ["bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-pink-50"];

  return (
    <div className="text-center my-14 px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
        Explore Our Products—
      </h2>
      <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
        Browse our complete collection — something for every taste and budget.
      </p>

      {/* Search Bar */}
      <div className="mt-6 max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="Search anything... AI will find it ✨"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-16 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 placeholder:italic focus:shadow-lg transition-all duration-200"
        />
        <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />

        {/* AI Badge */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
          AI
        </span>
      </div>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayedProducts.map((product, index) => (
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
              className="w-full h-40 object-cover rounded-xl mb-4"
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

export default AllProducts;
