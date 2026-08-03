import React, { useState, useEffect, useRef } from "react";
import transparant from "../assets/transparant.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import api from "../config/Api";
import toast from "react-hot-toast";

import { 
  FaSearch, 
  FaShoppingCart, 
  FaUserCircle, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaTachometerAlt,
  FaSun,
  FaMoon
} from "react-icons/fa";

const getUserPhoto = (u) => {
  if (!u || !u.photo) return null;
  if (typeof u.photo === "string" && u.photo !== "N/A" && u.photo.trim() !== "") {
    return u.photo;
  }
  if (typeof u.photo === "object" && u.photo?.url && u.photo.url !== "N/A" && u.photo.url.trim() !== "") {
    return u.photo.url;
  }
  return null;
};

const Header = () => {
  const { user, isLogin, role, logout } = useAuth();
  const { getItemCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);

  // Close profile dropdown menu when user touches / clicks anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = () => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    
    const currentRole = (role || user?.role || "").toLowerCase();
    switch (currentRole) {
      case "manager": 
        navigate("/resturant-dashboard"); 
        break;
      case "partner": 
        navigate("/rider-dashboard"); 
        break;
      case "customer": 
        navigate("/user-dashboard"); 
        break;
      case "admin": 
        navigate("/admin-dashboard"); 
        break;
      default: 
        navigate("/"); 
        break;
    }
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    try {
      await api.get("/auth/logout");
    } catch (err) {
      // Ignore logout API error if offline
    }
    if (logout) logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/order-now?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartCount = getItemCount();
  const photoUrl = getUserPhoto(user);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-100"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* 1. Brand Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all duration-300 transform group-hover:scale-105 ${
            isScrolled 
              ? "bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/20" 
              : "bg-white text-orange-600 shadow-black/20"
          }`}>
            <span className="text-xl">🛵</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-black tracking-tight leading-none ${isScrolled ? "text-slate-900" : "text-white"}`}>
              Creavings<span className="text-orange-500">.</span>
            </span>
            <span className={`text-[10px] font-bold tracking-wider uppercase opacity-80 ${isScrolled ? "text-orange-600" : "text-amber-300"}`}>
              Food Delivery
            </span>
          </div>
        </Link>

        {/* 2. Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-1/3 border border-transparent focus-within:border-orange-400 focus-within:bg-white transition-all shadow-inner"
        >
          <FaSearch className={`${isScrolled ? "text-gray-400" : "text-white/80"}`} />
          <input 
            type="text" 
            placeholder="Search for restaurants, dishes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent border-none outline-none w-full ml-2 text-sm placeholder-gray-300 ${isScrolled ? "text-gray-700 placeholder-gray-400" : "text-white"}`}
          />
        </form>

        {/* 3. Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          {["Home", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className={`transition-colors hover:underline underline-offset-4 ${
                isScrolled ? "text-slate-700 hover:text-orange-600" : "text-white hover:text-orange-100"
              }`}
            >
              {item}
            </Link>
          ))}
          <Link
            to="/order-now"
            className={`transition-colors font-bold ${
              isScrolled ? "text-orange-600 hover:text-orange-700" : "text-amber-200 hover:text-white"
            }`}
          >
            Order Now 🍽️
          </Link>
        </nav>

        {/* 4. Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Manual Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all duration-300 transform active:scale-95 ${
              isScrolled 
                ? "hover:bg-slate-100 text-slate-700 border border-slate-200" 
                : "hover:bg-white/20 text-white border border-white/20"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode (Shortcut: Alt+T)`}
            aria-label="Toggle Light and Dark Mode"
          >
            {isDark ? (
              <FaSun size={18} className="text-amber-400 animate-spin-slow" />
            ) : (
              <FaMoon size={18} className="text-indigo-600" />
            )}
          </button>

          {/* Cart Icon */}
          <Link to="/checkoutPage" className="relative group" title="View Cart">
            <div className={`p-2.5 rounded-full transition relative ${isScrolled ? "hover:bg-orange-50 text-slate-700" : "hover:bg-white/20 text-white"}`}>
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                      {cartCount}
                  </span>
                )}
            </div>
          </Link>

          {/* Auth Section */}
          <div className="hidden md:block" ref={dropdownRef}>
            {isLogin ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2.5 py-1.5 px-3.5 rounded-full border transition font-medium text-sm ${
                      isScrolled 
                        ? "border-gray-200 hover:bg-gray-50 text-slate-800" 
                        : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt={user?.fullName || "User"} 
                      className="w-7 h-7 rounded-full object-cover border border-amber-300 shadow-xs"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-200">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <FaUserCircle size={18} />}
                    </div>
                  )}
                  <span className="font-bold max-w-[120px] truncate">{user?.fullName || "Account"}</span>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-3 border border-slate-100 z-50 animate-fade-in-up transform origin-top-right">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
                      {photoUrl ? (
                        <img 
                          src={photoUrl} 
                          alt={user?.fullName || "User"} 
                          className="w-11 h-11 rounded-full object-cover border-2 border-orange-400 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "👤"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-slate-800 truncate">{user?.fullName || "User"}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-0.5 text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full uppercase">
                          {role || user?.role}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={handleNavigate} 
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3 font-extrabold mt-1 transition"
                    >
                        <FaTachometerAlt className="text-orange-500 text-base" /> Dashboard
                    </button>
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-extrabold border-t border-slate-100 mt-1 transition"
                    >
                        <FaSignOutAlt className="text-base" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition ${
                      isScrolled 
                        ? "text-orange-600 hover:bg-orange-50" 
                        : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className={`px-5 py-2 rounded-full font-bold text-sm shadow-md transform hover:scale-105 transition ${
                    isScrolled
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : "bg-white text-orange-600 hover:bg-slate-100"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden p-2 ${isScrolled ? "text-slate-800" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-5 flex flex-col gap-4 animate-slide-down">
          {["Home", "About", "Contact", "Order-Now"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className="text-slate-800 font-semibold py-2 border-b border-slate-50 hover:text-orange-600 flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{item.replace("-", " ")}</span>
            </Link>
          ))}
          
          {isLogin ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <button 
                  onClick={handleNavigate} 
                  className="flex items-center gap-3 text-slate-800 py-2.5 font-bold hover:text-orange-600"
                >
                    <FaTachometerAlt className="text-orange-500" />
                    Go to Dashboard
                </button>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 text-red-600 py-2.5 font-bold hover:bg-red-50 rounded-lg px-2"
                >
                    <FaSignOutAlt /> Logout
                </button>
              </div>
          ) : (
              <div className="flex flex-col gap-3 mt-2">
                  <button onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} className="w-full py-2.5 border border-orange-600 text-orange-600 rounded-xl font-bold">Login</button>
                  <button onClick={() => { setMobileMenuOpen(false); navigate("/register"); }} className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-bold shadow-md">Sign Up</button>
              </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;