import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaArrowRight, FaHome, FaUtensils, FaClock } from "react-icons/fa";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden text-center p-8 sm:p-12 space-y-6">
        
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <FaCheckCircle size={44} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
            Thank you for ordering with Creavings! Your food is being prepared by the restaurant.
          </p>
        </div>

        {/* Order Details Card */}
        {order ? (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 font-bold text-slate-700">
              <span>Order ID</span>
              <span className="text-orange-600 font-mono">{order.orderNumber || order._id}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span className="flex items-center gap-1.5"><FaClock className="text-amber-500" /> Estimated Time</span>
              <span className="font-bold text-slate-900">30-40 Minutes</span>
            </div>

            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>Total Paid</span>
              <span className="font-black text-slate-900 text-base">
                ₹{order.orderValue?.total?.toFixed(2) || "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>Payment Mode</span>
              <span className="capitalize font-bold text-slate-800">
                {order.orderValue?.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 text-orange-800 rounded-2xl p-4 text-xs font-semibold">
            Order confirmation logged in your customer account.
          </div>
        )}

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/user-dashboard", { state: { tab: "orders" } })}
            className="flex-1 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Track Order Status</span>
            <FaArrowRight size={12} />
          </button>

          <button
            onClick={() => navigate("/")}
            className="py-3.5 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
          >
            <FaHome /> Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccessPage;