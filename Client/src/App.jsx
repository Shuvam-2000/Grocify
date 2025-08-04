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

function AppContent() {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");

  return (
    <div className={isSellerPath ? "" : `px-4 sm:px-[5vw] md:px-[7vw] lg:px-[2vw]`}>
      {!isSellerPath && <Navbar />}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/allproducts" element={<Allproducts />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
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
