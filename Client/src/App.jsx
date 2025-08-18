import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/pages/customer/Home";
import Allproducts from "./components/pages/customer/Allproducts";
import CartPage from "./components/pages/customer/CartPage";
import Navbar from "../src/components/pages/customer/Navbar";
import { useLocation } from "react-router-dom";
import "./index.css";
import ProductDetail from "./components/pages/customer/ProductDetail";
import Footer from "./components/pages/customer/Footer";
import Login from "./components/pages/customer/Login";
import SignUp from "./components/pages/customer/SignUp";
import ProtectedRoute from "./components/pages/customer/ProtectedRoute";
import SellerLogin from "./components/pages/seller/SellerLogin";
import SellerSignUp from "./components/pages/seller/SellerSignUp";
import SelllerDashBoard from "./components/pages/seller/SelllerDashBoard";
import { Toaster } from "react-hot-toast";
import SellerAllProduct from "./components/pages/seller/SellerAllProduct";
import AddProduct from "./components/pages/seller/AddProduct";
import Checkout from "./components/pages/customer/Checkout";
import OrderPage from "./components/pages/customer/OrderPage";
import SellerOrder from "./components/pages/seller/SellerOrder";

function AppContent() {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");

  return (
    <div
      className={isSellerPath ? "" : `px-4 sm:px-[5vw] md:px-[7vw] lg:px-[2vw]`}
    >
      <Toaster />
      {!isSellerPath && <Navbar />}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/allproducts" element={<Allproducts />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

         {/* Seller route */}
        <Route path="/seller" element={<SellerLogin />} />
        <Route path="/seller/signup" element={<SellerSignUp />} />
        <Route path="/seller/dashboard" element={<SelllerDashBoard />} />
        <Route path="/seller/allproduct" element={<SellerAllProduct />} />
        <Route path="/seller/addproduct" element={<AddProduct />} />
        <Route path="/seller/getorders" element={<SellerOrder />} />
      </Routes>
      {!isSellerPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
