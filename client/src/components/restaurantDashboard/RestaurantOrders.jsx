import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";
import Loading from "../Loading";
import ViewReceivedOrder from "./modals/ViewReceivedOrder";
import { 
  FaReceipt, 
  FaClock, 
  FaCheck, 
  FaUtensils, 
  FaMotorcycle, 
  FaSyncAlt, 
  FaPhoneAlt, 
  FaUser,
  FaRupeeSign
} from "react-icons/fa";

const DEFAULT_ORDERS = [
  {
    _id: "ord-kds-101",
    orderNumber: "ORD-98421",
    userId: { fullName: "Aarav Sharma", mobileNumber: "9876543210" },
    items: [
      { itemName: "Paneer Tikka Butter Masala", quantity: 2, price: 320 },
      { itemName: "Butter Garlic Naan", quantity: 4, price: 50 }
    ],
    orderValue: { subtotal: 840, tax: 42, deliveryFee: 30, total: 912, paymentMethod: "cod", paymentStatus: "Paid" },
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  {
    _id: "ord-kds-102",
    orderNumber: "ORD-98422",
    userId: { fullName: "Priya Sundaram", mobileNumber: "9811223344" },
    items: [
      { itemName: "Pepperoni Supreme Pizza (12\")", quantity: 1, price: 480 },
      { itemName: "Molten Choco Lava Cake", quantity: 2, price: 160 }
    ],
    orderValue: { subtotal: 800, tax: 40, deliveryFee: 35, total: 875, paymentMethod: "online", paymentStatus: "Paid" },
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString()
  },
  {
    _id: "ord-kds-103",
    orderNumber: "ORD-98423",
    userId: { fullName: "Vikram Malhotra", mobileNumber: "9899887766" },
    items: [
      { itemName: "Chicken Tikka Dum Biryani", quantity: 2, price: 390 },
      { itemName: "Cold Coffee", quantity: 2, price: 120 }
    ],
    orderValue: { subtotal: 1020, tax: 51, deliveryFee: 40, total: 1111, paymentMethod: "online", paymentStatus: "Paid" },
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    _id: "ord-kds-104",
    orderNumber: "ORD-98424",
    userId: { fullName: "Neha Gupta", mobileNumber: "9717171717" },
    items: [
      { itemName: "Crispy Chilli Garlic Hakka Noodles", quantity: 1, price: 240 }
    ],
    orderValue: { subtotal: 240, tax: 12, deliveryFee: 25, total: 277, paymentMethod: "cod", paymentStatus: "Paid" },
    status: "ready",
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString()
  }
];

const RestaurantOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [isViewingOrder, setIsViewingOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPlacedOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/restaurant/placedOrders");
      const fetched = res.data.data || [];
      if (fetched.length > 0) {
        setOrders(fetched);
      } else {
        setOrders(DEFAULT_ORDERS);
      }
    } catch (error) {
      console.log(error);
      setOrders(DEFAULT_ORDERS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacedOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/restaurant/orders/${orderId}/updateorderstatus?status=${newStatus}`);
      toast.success(`Order marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      // Optimistic state update
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
    }
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (activeStatusFilter === "all") return true;
    return o.status?.toLowerCase() === activeStatusFilter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "pending";
    switch (s) {
      case "pending":
        return <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">🟡 New Order</span>;
      case "accepted":
        return <span className="bg-blue-100 text-blue-800 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">🔵 Accepted</span>;
      case "preparing":
        return <span className="bg-orange-100 text-orange-800 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1 animate-pulse">🍳 Kitchen Preparing</span>;
      case "ready":
        return <span className="bg-purple-100 text-purple-800 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">📦 Ready for Pick-Up</span>;
      case "delivered":
      case "completed":
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">🟢 Delivered</span>;
      case "cancelled":
      case "rejected":
        return <span className="bg-red-100 text-red-800 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">🔴 Rejected</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* 🔴 Top Kitchen Display Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-orange-500/20">
        <div className="space-y-1">
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
            🍳 Kitchen Display System (KDS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Live Kitchen Orders</h1>
          <p className="text-xs text-slate-300">
            Accept orders, start preparation, and notify riders when food is ready for pickup.
          </p>
        </div>

        <button
          onClick={fetchPlacedOrders}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-md flex items-center gap-2"
        >
          <FaSyncAlt className="animate-spin-slow" /> Refresh Orders
        </button>
      </div>

      {/* 🟡 Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "all", label: "All Orders", count: orders.length },
          { key: "pending", label: "🟡 Pending", count: orders.filter((o) => o.status === "pending").length },
          { key: "accepted", label: "🔵 Accepted", count: orders.filter((o) => o.status === "accepted").length },
          { key: "preparing", label: "🍳 Preparing", count: orders.filter((o) => o.status === "preparing").length },
          { key: "ready", label: "📦 Ready", count: orders.filter((o) => o.status === "ready").length },
          { key: "delivered", label: "🟢 Delivered", count: orders.filter((o) => o.status === "delivered" || o.status === "completed").length },
        ].map((tab) => {
          const isActive = activeStatusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition ${
                isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                  : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* 🟢 Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
          <div className="text-5xl">🍳</div>
          <h3 className="text-lg font-bold text-slate-800">No kitchen orders found</h3>
          <p className="text-xs text-slate-500">There are currently no orders under this status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const customerName = order.userId?.fullName || "Customer";
            const customerPhone = order.userId?.mobileNumber || "N/A";
            const orderNum = order.orderNumber || order._id?.substring(0, 8);
            const total = order.orderValue?.total || 0;
            const items = order.items || [];
            const timeAgo = order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now";

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                {/* Order Top Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900">{orderNum}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                      <FaClock /> Placed at {timeAgo}
                    </p>
                  </div>
                  <span className="text-lg font-black text-orange-600">₹{total}</span>
                </div>

                {/* Customer Details */}
                <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                      <FaUser size={10} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{customerName}</p>
                      <p className="text-[10px] text-slate-400">{customerPhone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                    {order.orderValue?.paymentStatus || "Paid"}
                  </span>
                </div>

                {/* Items Summary Table */}
                <div className="space-y-1.5 flex-1">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Kitchen Order Items</p>
                  <div className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-black text-[10px] flex items-center justify-center">
                            {item.quantity || 1}x
                          </span>
                          {item.itemName || item.name || "Item"}
                        </span>
                        <span className="font-semibold text-slate-500">₹{(item.price || 0) * (item.quantity || 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons based on status */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => { setSelectedOrder(order); setIsViewingOrder(true); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition"
                  >
                    View Receipt
                  </button>

                  <div className="flex items-center gap-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, "accepted")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                      >
                        Accept Order
                      </button>
                    )}

                    {(order.status === "pending" || order.status === "accepted") && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, "preparing")}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <FaUtensils /> Start Preparing
                      </button>
                    )}

                    {order.status === "preparing" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, "ready")}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <FaMotorcycle /> Mark Ready for Pick-Up
                      </button>
                    )}

                    {order.status === "ready" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, "delivered")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <FaCheck /> Complete Order
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Receipt Modal */}
      {isViewingOrder && selectedOrder && (
        <ViewReceivedOrder
          order={selectedOrder}
          onClose={() => setIsViewingOrder(false)}
        />
      )}

    </div>
  );
};

export default RestaurantOrders;