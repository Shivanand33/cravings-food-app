import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import Loading from "../Loading";
import { FaRupeeSign, FaCheckCircle, FaMoneyBillWave, FaArrowUp, FaDownload } from "react-icons/fa";

const RestaurantEarnings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get("/restaurant/placedOrders");
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to load earnings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const totalEarnings = deliveredOrders.reduce((sum, o) => sum + (o.orderValue?.total || 0), 0);
  const pendingPayouts = orders
    .filter((o) => ["pending", "accepted", "preparing", "ready"].includes(o.status))
    .reduce((sum, o) => sum + (o.orderValue?.total || 0), 0);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans p-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Earnings & Revenue Reports 💸</h2>
          <p className="text-xs text-slate-500 font-medium">Track your restaurant's payouts and order revenues</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <FaDownload /> Print Statement
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Total Settled Revenue</p>
          <p className="text-3xl font-black text-emerald-600">₹{totalEarnings.toFixed(2)}</p>
          <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <FaArrowUp /> From {deliveredOrders.length} completed orders
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Pending Kitchen Revenue</p>
          <p className="text-3xl font-black text-amber-600">₹{pendingPayouts.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500 font-medium">Orders currently in progress</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Payout Settlement Status</p>
          <span className="inline-block bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            Auto Weekly Transfer
          </span>
          <p className="text-[11px] text-slate-500 font-medium">Settles to your linked bank account</p>
        </div>
      </div>

      {/* Delivered Orders Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xl font-extrabold text-slate-900">Completed Order Receipts</h3>
          <p className="text-xs text-slate-500">Itemized list of all delivered orders</p>
        </div>

        {deliveredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-2 text-slate-500">
            <p className="text-base font-bold">No completed orders yet</p>
            <p className="text-xs">Once orders are marked as delivered, revenue will reflect here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[11px] tracking-wider text-left">
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3 text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {deliveredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-orange-600 font-extrabold">
                      {ord.orderNumber || ord._id}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {ord.userId?.fullName || "Customer"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 uppercase text-slate-600 font-bold">
                      {ord.orderValue?.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-slate-900">
                      ₹{ord.orderValue?.total?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default RestaurantEarnings;