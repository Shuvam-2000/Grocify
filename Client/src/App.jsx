import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/pages/customer/Home";
import Allproducts from "./components/pages/customer/Allproducts";
import CartPage from "./components/pages/customer/CartPage";
import Navbar from "../src/components/pages/customer/Navbar";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
