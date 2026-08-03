import React from "react";
import { Link } from "react-router-dom";
import transparant from "../assets/transparant.png";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaApple, 
  FaGooglePlay, 
  FaHeart 
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header & Brand */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-10">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={transparant}
              alt="Creavings Logo"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <span className="text-3xl font-black text-white tracking-tight">
              Creavings<span className="text-orange-500">.</span>
            </span>
          </Link>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Connecting food lovers with the finest local restaurants and fast delivery riders across the city.
          </p>

          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-orange-600 hover:text-white text-slate-300 flex items-center justify-center transition">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-orange-600 hover:text-white text-slate-300 flex items-center justify-center transition">
              <FaTwitter size={14} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-orange-600 hover:text-white text-slate-300 flex items-center justify-center transition">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-orange-600 hover:text-white text-slate-300 flex items-center justify-center transition">
              <FaLinkedinIn size={14} />
            </a>
          </div>
        </div>

        {/* 4 Columns Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs sm:text-sm">
          
          <div className="space-y-4">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider">About Creavings</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-orange-400 transition">Who We Are</Link></li>
              <li><Link to="/about" className="hover:text-orange-400 transition">Blog & Food News</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Work With Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Investor Relations</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider">For Foodies</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li><Link to="/order-now" className="hover:text-orange-400 transition">Explore Restaurants</Link></li>
              <li><Link to="/order-now" className="hover:text-orange-400 transition">Order Food Online</Link></li>
              <li><Link to="/user-dashboard" className="hover:text-orange-400 transition">My Account & Orders</Link></li>
              <li><Link to="/checkoutPage" className="hover:text-orange-400 transition">Cart Checkout</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider">For Partners</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li><Link to="/register" className="hover:text-orange-400 transition">Add Your Restaurant</Link></li>
              <li><Link to="/register" className="hover:text-orange-400 transition">Become a Delivery Rider</Link></li>
              <li><Link to="/resturant-dashboard" className="hover:text-orange-400 transition">Restaurant Dashboard</Link></li>
              <li><Link to="/rider-dashboard" className="hover:text-orange-400 transition">Rider Partner Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider">Learn More</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li><Link to="/contact" className="hover:text-orange-400 transition">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Security & Safety</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Help & Support</Link></li>
            </ul>
          </div>

        </div>

        {/* App Links & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Creavings Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <FaHeart className="text-orange-500" /> for food lovers everywhere.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;