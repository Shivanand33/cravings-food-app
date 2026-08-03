import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import { FaMotorcycle, FaCheckCircle, FaRupeeSign } from "react-icons/fa";

const RiderOverview = () => {
  const { user } = useAuth();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);

  const fetchData = async () => {
    try {
      const [compRes, ongRes] = await Promise.allSettled([
        api.get("/rider/completedOrder"),
        api.get("/rider/ongoingOrder")
      ]);

      if (compRes.status === "fulfilled") {
        setCompletedOrders(compRes.value.data.data || []);
      }
      if (ongRes.status === "fulfilled") {
        setOngoingOrders(ongRes.value.data.data || []);
      }
    } catch (err) {
      console.error("Error loading rider overview:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDelivered = completedOrders.filter((o) => o.status === "delivered").length;
  const totalEarnings = totalDelivered * 60; // Estimated ₹60 per delivery payout

  return (
    <div className="space-y-8 font-sans p-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
          🛵 Rider Partner Dashboard
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">
          Welcome, {user?.fullName || "Delivery Partner"}!
        </h1>
        <p className="text-xs text-slate-300">
          Accept food delivery requests and navigate efficiently across the city.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase text-amber-500">Active Delivery</p>
          <p className="text-2xl font-black text-amber-600">{ongoingOrders.length}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase text-emerald-500">Total Delivered</p>
          <p className="text-2xl font-black text-emerald-600">{totalDelivered}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase text-indigo-500">Estimated Earnings</p>
          <p className="text-2xl font-black text-indigo-600">₹{totalEarnings.toFixed(2)}</p>
        </div>
      </div>

    </div>
  );
};

export default RiderOverview;