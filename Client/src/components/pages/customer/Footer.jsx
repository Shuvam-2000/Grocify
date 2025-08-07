import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const sellertoken = localStorage.getItem("sellertoken")
  return (
    <div className="text-[#414141] py-14 px-6 sm:px-20 border-t border-gray-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 sm:gap-20">

        {/* Left: Branding */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 font-mono">
            Grocify
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-mono text-gray-600 max-w-xs">
            Your one-stop solution for daily groceries. Fresh, fast, and reliable delivery at your doorstep.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-base sm:text-lg font-semibold">Quick Links</h2>
          <Link to="/" className="text-sm hover:text-gray-700 text-gray-600 font-mono">
            Home
          </Link>
          <Link to="/product" className="text-sm hover:text-gray-700 text-gray-600 font-mono">
            Browse Products
          </Link>
          <Link to="/cart" className="text-sm hover:text-gray-700 text-gray-600 font-mono">
            My Cart
          </Link>
          <Link to={sellertoken ? "/seller/dashboard" : "/seller"} className="text-sm hover:text-gray-700 text-gray-600 font-mono">
            Seller Dashboard
          </Link>
        </div>

        {/* Right: Social Media */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          <h2 className="text-base sm:text-lg font-semibold mb-1">Connect With Us</h2>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-green-600">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-500">
              <Twitter size={20} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;
