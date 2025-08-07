import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";
import { setSeller } from "../../../store/sellerSlice";
import { ArrowLeft } from "lucide-react";
import bookOrderImage from "../../../assets/book-order.png";

const SellerLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/seller/seller-login", data);
      const sellertoken = res.data?.token;
      if (sellertoken) {
        localStorage.setItem("sellertoken", sellertoken);
        dispatch(setSeller(res.data?.seller));
        toast.success(res.data?.message || "Login Sucessful");
        navigate("/seller/dashboard");
        reset();
      } else {
        toast.error(res.data?.message || "Error Login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-gray-100 flex flex-col justify-between items-center p-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-700 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Seller Icon */}
        <div className="flex-grow flex justify-center items-center">
          <img
            src={bookOrderImage}
            alt="Seller Login"
            className="max-w-xl w-full mt-6 h-auto rounded-md"
          />
        </div>

        <div className="text-sm text-gray-400 mt-2 sm:mb-4">
          © 2025 Grocify • Seller Portal
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center px-4 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200"
        >
          <div className="flex flex-col items-center mb-6">
            <p className="text-3xl font-mono font-bold text-gray-800">
              Seller Login
            </p>
            <div className="w-12 h-1 bg-primary-dull mt-2 rounded-full" />
          </div>

          {/* Email Field */}
          <input
            type="text"
            className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f21c1c] ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter Your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}

          {/* Password Field */}
          <input
            type="password"
            className={`w-full mt-4 px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f21c1c] ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter Your Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`bg-primary text-white font-mono px-10 py-2 mt-4 rounded-lg transition-all cursor-pointer ${
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-primary"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              Don't Have An Account?{" "}
              <span
                onClick={() => navigate("/seller/signup")}
                className="text-primary-dull cursor-pointer hover:underline"
              >
                SignUp
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerLogin;
