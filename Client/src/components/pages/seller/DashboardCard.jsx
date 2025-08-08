import { Package, PlusCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardCard = () => {
  const navigate= useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl sm:mt-30 mt-20">
        {/* All Products Card */}
        <div onClick={() => navigate("/seller/allproduct")} className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl h-60 p-10 flex flex-col items-center justify-center text-center cursor-pointer">
          <Package className="w-12 h-12 text-blue-600" />
          <h2 className="text-2xl font-semibold mt-6">All Products</h2>
        </div>

        {/* Add New Product Card */}
        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl h-60 p-10 flex flex-col items-center justify-center text-center cursor-pointer">
          <PlusCircle className="w-12 h-12 text-green-600" />
          <h2 className="text-2xl font-semibold mt-6">Add New Product</h2>
        </div>

        {/* Orders Card */}
        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl h-60 p-10 flex flex-col items-center justify-center text-center cursor-pointer">
          <ShoppingCart className="w-12 h-12 text-orange-600" />
          <h2 className="text-2xl font-semibold mt-6">Orders</h2>
        </div>
      </div>

      {/* Back to Home Button */}
      <button onClick={() => navigate("/")} className="mt-14 flex items-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
    </div>
  );
};

export default DashboardCard;
