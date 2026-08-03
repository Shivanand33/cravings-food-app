import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/Api";
import { 
  FaShoppingBag, 
  FaRupeeSign, 
  FaMotorcycle, 
  FaArrowRight, 
  FaUtensils, 
  FaUserEdit,
  FaClock
} from "react-icons/fa";

const UserOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/user/placedorders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.orderValue?.total || 0), 0);
  const activeOrders = orders.filter((o) =>
    ["pending", "accepted", "preparing", "ready", "pickedUp", "onTheWay"].includes(o.status)
  );

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            👋 Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.fullName || "Foodie"}!
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm font-medium">
            Satisfy your hunger today. Explore delicious meals from top rated restaurants around you.
          </p>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => navigate("/order-now")}
              className="px-5 py-2.5 bg-white text-orange-600 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-orange-50 transition active:scale-95 flex items-center gap-2"
            >
              <FaUtensils /> Order Food Now
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Orders Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
            <FaShoppingBag />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-slate-900">{totalOrders}</p>
            <p className="text-[11px] text-slate-500">Food orders placed</p>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
            <FaRupeeSign />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Spent</p>
            <p className="text-2xl font-black text-slate-900">₹{totalSpent.toFixed(2)}</p>
            <p className="text-[11px] text-slate-500">Lifetime order value</p>
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
            <FaMotorcycle />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Orders</p>
            <p className="text-2xl font-black text-slate-900">{activeOrders.length}</p>
            <p className="text-[11px] text-slate-500">Currently in progress</p>
          </div>
        </div>

      </div>

      {/* Recent Activity / Active Order Live Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-800">
            Recent Orders
          </h2>
          <button
            onClick={() => navigate("/user-dashboard", { state: { tab: "orders" } })}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            View All <FaArrowRight size={10} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading order history...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="text-4xl">🍕</div>
            <p className="text-slate-600 font-bold">No orders placed yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your favorite meals are just a few clicks away. Browse top restaurants and place your first order.
            </p>
            <button
              onClick={() => navigate("/order-now")}
              className="px-5 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-orange-700"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map((ord) => (
              <div
                key={ord._id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-orange-50/30 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-orange-600">{ord.orderNumber}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        ord.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : ord.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800 animate-pulse"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {ord.restaurantId?.restaurantName || ord.restaurantId?.fullName || "Restaurant Partner"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {ord.items?.length || 0} items • {new Date(ord.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end">
                  <span className="font-black text-slate-900 text-sm">
                    ₹{ord.orderValue?.total?.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {ord.orderValue?.paymentMethod === "cod" ? "COD" : "Online Paid"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserOverview;
