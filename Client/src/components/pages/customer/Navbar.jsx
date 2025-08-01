import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Search, Menu, User } from "lucide-react";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const username = "Shuvam"; 

  return (
    <div className="flex items-center justify-between py-4 px-4 sm:px-8 border-b border-gray-200 bg-white shadow-sm relative">
      {/* Logo */}
      <h1 className="sm:text-3xl text-2xl font-extrabold text-green-700 cursor-pointer">
        Grocify
      </h1>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 font-medium text-gray-700 items-center">
        <NavLink to="/" className="hover:text-lime-600 transition">
          Home
        </NavLink>
        <NavLink to="/allproducts" className="hover:text-lime-600 transition">
          All Products
        </NavLink>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-6 relative">
        {/* Search Icon */}
        <Search className="w-5 md:w-6 h-5 ml-2 md:ml-0 text-gray-600 cursor-pointer" />

        {/* Cart with Badge */}
        <NavLink to="/cart" className="relative">
          <ShoppingCart className="w-5 md:w-6 h-6 text-green-700" />
          <span className="absolute top-[-6px] right-[-8px] bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            0
          </span>
        </NavLink>
        {/* Profile Dropdown */}
        <div className="relative">
          <User
            className="w-5 md:w-6 h-6 text-green-700 cursor-pointer"
            onClick={() => setProfileDropdown(!profileDropdown)}
          />
          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-2 z-50 text-sm text-gray-700">
              <div className="px-4 py-2 font-semibold">Hi, {username}</div>
              <NavLink
                to="/orders"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setProfileDropdown(false)}
              >
                Your Orders
              </NavLink>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setProfileDropdown(false);
                  // Add logout logic here
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Login Button */}
        <NavLink to="/login">
          <button className="hidden md:block px-4 py-2 bg-green-700 text-white rounded-full text-sm font-medium hover:bg-green-800 transition">
            Login
          </button>
        </NavLink>

        {/* Hamburger Icon */}
        <Menu
          className="w-5 h-6 text-green-700 cursor-pointer md:hidden"
          onClick={() => setMenuVisible(!menuVisible)}
        />
      </div>

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "75%" }}
      >
        <div className="flex flex-col gap-6 p-6">
          <button
            onClick={() => setMenuVisible(false)}
            className="self-end text-3xl font-bold text-gray-700"
          >
            &times;
          </button>

          <NavLink
            to="/"
            onClick={() => setMenuVisible(false)}
            className="text-lg font-medium text-gray-700 hover:text-lime-600"
          >
            Home
          </NavLink>
          <NavLink
            to="/allproducts"
            onClick={() => setMenuVisible(false)}
            className="text-lg font-medium text-gray-700 hover:text-lime-600"
          >
            All Products
          </NavLink>

          {/* Cart Link */}
          <NavLink
            to="/cart"
            onClick={() => setMenuVisible(false)}
            className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-lime-600 relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-[-6px] left-[-6px] bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </div>
            <span>Cart</span>
          </NavLink>
          <NavLink
            to="/login"
            onClick={() => setMenuVisible(false)}
            className="text-lg font-medium text-gray-700 hover:text-lime-600"
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
