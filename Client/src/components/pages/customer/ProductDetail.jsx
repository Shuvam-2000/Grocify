import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "../../../utils/axios";
import { setSingleProduct } from "../../../store/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleproduct } = useSelector((store) => store.product);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleProductDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/product/get-product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const product = res.data?.product?.[0];

      if (!product) {
        toast.error("Product not found");
        return;
      }

      dispatch(setSingleProduct(product));
      setMainImage(product.image?.[0]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch product details"
      );
    } finally {
      setLoading(false); 
    }
  };

  const addToCart = async () => {
    // add to cart API integration
  };

  useEffect(() => {
    handleProductDetail();
  }, [dispatch, id]);

  // Spinner shown while loading
  if (loading || !singleproduct) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Image Section */}
        <div className="flex flex-col gap-4">
          <img
            src={mainImage}
            alt="Product"
            className="w-full max-w-md object-cover border rounded-xl"
          />
          <div className="flex gap-2 flex-wrap">
            {singleproduct.image?.map((img, index) => (
              <img
                key={singleproduct._id || index}
                src={img}
                alt={`thumb-${index}`}
                className="w-20 h-20 object-cover border cursor-pointer rounded-lg hover:scale-105 transition"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{singleproduct.name}</h2>

          <p className="text-gray-700">
            {Array.isArray(singleproduct.description)
              ? singleproduct.description.join(", ")
              : singleproduct.description}
          </p>

          <p className="text-lg font-semibold">
            Category: {singleproduct.category}
          </p>
          <p className="text-2xl font-bold text-red-500">
            Actual Price: ₹ {singleproduct.price}
          </p>
          <p className="text-2xl font-bold text-green-600">
            Offer Price: ₹ {singleproduct.offerPrice}
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={addToCart}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Add to Cart
            </button>
            <button
              onClick={addToCart}
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mt-20">
        <h3 className="text-2xl font-semibold mb-4">Recommended Products by AI</h3>
        <div className="text-gray-600 italic">
          Coming soon: Smart recommendations powered by AI...
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
