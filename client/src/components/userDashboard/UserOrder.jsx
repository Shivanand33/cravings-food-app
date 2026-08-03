import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";
import Loading from "../Loading";
import { FaShoppingBag, FaClock, FaEye, FaTimes, FaReceipt, FaMotorcycle } from "react-icons/fa";

const UserOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllPlacedOrder = async (isFirstLoad = false) => {
    if (isFirstLoad) setIsLoading(true);
    try {
      const res = await api.get("/user/placedorders");
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      if (isFirstLoad) {
        toast.error(error?.response?.data?.message || "Failed to load orders");
      }
    } finally {
      if (isFirstLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPlacedOrder(true);
    const interval = setInterval(() => {
      fetchAllPlacedOrder(false);
    }, 15000); // Silent refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">Delivered</span>;
      case "cancelled":
      case "rejected":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">{status}</span>;
      case "preparing":
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase animate-pulse">Preparing Dish</span>;
      case "pickedUp":
      case "onTheWay":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase animate-pulse">On The Way 🛵</span>;
      case "accepted":
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold uppercase">Order Accepted</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase">Pending</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loading />
      </div>
    );
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await api.patch(`/user/cancelorder/${orderId}`);
      toast.success(res.data.message || "Order cancelled successfully");
      fetchAllPlacedOrder(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order History 📋</h2>
            <p className="text-xs text-slate-500 font-medium">Track your active orders and view past receipts</p>
          </div>
          <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full">
            {orders.length} Total Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">🛍️</div>
            <h3 className="text-lg font-bold text-slate-800">No orders placed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't ordered any meals yet. Explore top restaurants and start ordering!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:bg-white hover:border-orange-200 hover:shadow-md transition duration-200 space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                      {order.orderNumber || order._id}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• {new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Body Details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900">
                      {order.restaurantId?.restaurantName || order.restaurantId?.fullName || "Restaurant Partner"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {order.items?.map((i) => `${i.itemName} (x${i.quantity || 1})`).join(", ")}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      Payment: <span className="uppercase text-slate-800 font-bold">{order.orderValue?.paymentMethod}</span> ({order.orderValue?.paymentStatus})
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Amount</p>
                      <p className="text-lg font-black text-slate-900">₹{order.orderValue?.total?.toFixed(2)}</p>
                    </div>

                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-xl transition"
                      >
                        Cancel Order
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <FaEye /> View Receipt
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in-up relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-lg shrink-0">
                <FaReceipt />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Order Summary</h3>
                <p className="text-xs font-mono text-orange-600 font-bold">{selectedOrder.orderNumber}</p>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-1 text-xs text-slate-600 font-medium">
              <p className="font-black text-slate-900 text-sm">
                {selectedOrder.restaurantId?.restaurantName || selectedOrder.restaurantId?.fullName}
              </p>
              <p>{selectedOrder.restaurantId?.address}, {selectedOrder.restaurantId?.city}</p>
              <p>📞 {selectedOrder.restaurantId?.mobileNumber}</p>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Ordered Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-800 bg-slate-50/50 p-2.5 rounded-xl">
                    <span>{item.itemName} x {item.quantity || 1}</span>
                    <span className="font-black">₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.orderValue?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹{selectedOrder.orderValue?.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{selectedOrder.orderValue?.deliveryFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-base border-t border-slate-100 pt-2">
                <span>Total</span>
                <span className="text-orange-600">₹{selectedOrder.orderValue?.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;