import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/pages/customer/Home";
import Allproducts from "./components/pages/customer/Allproducts";
import CartPage from "./components/pages/customer/CartPage";
import Navbar from "../src/components/pages/customer/Navbar";
import { useLocation } from "react-router-dom";

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
      </Routes>
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
