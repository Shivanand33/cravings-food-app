import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import { FaShoppingBag, FaRupeeSign, FaUtensils, FaClock } from "react-icons/fa";

const RestaurantOverview = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordRes, menuRes] = await Promise.allSettled([
        api.get("/restaurant/placedOrders"),
        api.get("/restaurant/menuItems")
      ]);

      if (ordRes.status === "fulfilled") {
        setOrders(ordRes.value.data.data || []);
      }
      if (menuRes.status === "fulfilled") {
        setMenuItems(menuRes.value.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => ["pending", "accepted", "preparing"].includes(o.status));
  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.orderValue?.total || 0), 0);

  return (
    <div className="space-y-8 font-sans p-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
          🏪 Restaurant Manager Portal
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">
          {user?.restaurantName !== "N/A" ? user?.restaurantName : "Manager Overview"}
        </h1>
        <p className="text-xs text-slate-300">
          Manage kitchen orders, menu dishes, and track customer earnings.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase text-slate-400">Total Orders</p>
          <p className="text-2xl font-black text-slate-900">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase text-amber-500">Active Kitchen Orders</p>
          <p className="text-2xl font-black text-amber-600">{pendingOrders.length}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase text-emerald-500">Delivered Revenue</p>
          <p className="text-2xl font-black text-emerald-600">₹{totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase text-indigo-500">Menu Dishes</p>
          <p className="text-2xl font-black text-indigo-600">{menuItems.length}</p>
        </div>
      </div>

    </div>
  );
};

export default RestaurantOverview;