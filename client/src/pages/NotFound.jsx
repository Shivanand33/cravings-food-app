import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaHome } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50/70 p-4 font-sans text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl space-y-6">
        <div className="text-6xl font-black text-orange-600 tracking-tighter">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Page Not Found 🔍
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Looks like the dish or page you are looking for has been moved or doesn't exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <FaHome /> Go to Home
          </button>
          <button
            onClick={() => navigate("/order-now")}
            className="py-3 px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <FaUtensils /> Order Food
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;