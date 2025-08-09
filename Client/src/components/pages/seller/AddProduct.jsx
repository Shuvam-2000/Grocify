import { useSelector, useDispatch } from "react-redux";
import { logout, setSellerProduct } from "../../../store/sellerSlice";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { assets } from "../../../assets/assets";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const seller = useSelector((store) => store.seller?.seller);
   const sellerProduct = useSelector((store) => store.seller?.sellerProduct);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState([null, null, null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updatedImages = [...image];
    updatedImages[index] = file;
    setImage(updatedImages);
  };

  const addNewProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("sellertoken");
      if (!token) {
        toast.error("No seller token found");
        setIsSubmitting(false);
        return;
      }

      if (!image.some((img) => img)) {
        toast.error("Please upload at least one image");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("category", category);

      image.forEach((img) => {
        if (img) formData.append("image", img);
      });

      const res = await axios.post("/api/product/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setSellerProduct([...sellerProduct, res.data.product]));
      toast.success("Product Added Successfully!");
      navigate("/seller/allproduct");

      // Reset form
      setName("");
      setPrice("");
      setOfferPrice("");
      setCategory("");
      setImage([null, null, null, null, null]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sellertoken");
    dispatch(logout());
    navigate("/seller");
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

      {/* Form */}
      <form
        onSubmit={addNewProduct}
        className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-6 space-y-6"
      >
        {/* Image Upload */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {image.map((img, index) => (
            <label
              key={index}
              className="w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg cursor-pointer relative"
            >
              {img ? (
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <img src={assets.upload_area} alt="Upload" className="w-12" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, index)}
              />
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="number"
          placeholder="Offer Price"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-semibold"
        >
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </>
  );
};

export default AddProduct;
