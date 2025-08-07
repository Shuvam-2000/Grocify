import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/sellerSlice"; 
import DashboardCard from "./DashboardCard";

const SelllerDashBoard = () => {
  const seller = useSelector((store) => store.seller?.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("sellertoken");
    dispatch(logout());
    navigate("/seller");
  };

  return (
    <>
      <div className="flex items-center justify-between py-4 px-4 sm:px-8 border-b border-gray-300 bg-white relative">
        {/* Seller Name */}
        <h1
          onClick={() => navigate("/seller/dashboard")}
          className="sm:text-3xl text-2xl font-extrabold text-black cursor-pointer"
        >
          Hi,{" "}
          <span className="text-green-700">
            {seller?.name ? seller.name : "Seller"}
          </span>
        </h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm bg-green-700 transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Seller Dashboard Cards */}
      <div>
        <DashboardCard />
      </div>
    </>
  );
};

export default SelllerDashBoard;
