import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";
import { setUser } from "../../../store/userSlice";

const Login = () => {
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
      const res = await axios.post("/api/user/login", data);
      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        dispatch(setUser(res.data?.user));
        toast.success(res.data?.message || "Login SuccessFull");
        navigate("/");
        console.log()
        reset();
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
        reset()
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200"
      >
        <div className="flex flex-col items-center mb-6">
          <p className="text-3xl font-mono font-bold text-gray-800">Login</p>
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
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
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

        {/* Admin Register Link */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Don't Have An Account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary-dull cursor-pointer hover:underline"
            >
              SignUp
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
