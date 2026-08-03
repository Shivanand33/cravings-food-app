import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import Loading from "../Loading";
import { FaMotorcycle, FaCheckCircle, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";

const RiderOrderHistory = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/rider/completedOrder");
        setCompletedOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch rider history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans p-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Delivery History 🛵</h2>
            <p className="text-xs text-slate-500 font-medium">Log of all completed and past order deliveries</p>
          </div>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full">
            {completedOrders.length} Completed Trips
          </span>
        </div>

        {completedOrders.length === 0 ? (
          <div className="text-center py-16 space-y-2 text-slate-500">
            <div className="text-5xl">🛵</div>
            <p className="text-base font-bold">No completed deliveries yet</p>
            <p className="text-xs">Accept orders from the Available Orders tab to start earning.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedOrders.map((ord) => (
              <div
                key={ord._id}
                className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:bg-white hover:border-blue-200 transition space-y-3"
              >
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2 text-xs">
                  <span className="font-mono text-orange-600 font-extrabold">{ord.orderNumber || ord._id}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-black uppercase bg-green-100 text-green-800">
                    {ord.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-800">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Pickup Restaurant</p>
                    <p className="font-extrabold text-slate-900">{ord.restaurantId?.restaurantName || ord.restaurantId?.fullName}</p>
                    <p className="text-[11px] text-slate-500">{ord.restaurantId?.city}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Drop Customer</p>
                    <p className="font-extrabold text-slate-900">{ord.userId?.fullName}</p>
                    <p className="text-[11px] text-slate-500">{ord.userId?.address || ord.userId?.city}</p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Trip Earnings</p>
                    <p className="text-base font-black text-emerald-600">₹60.00</p>
                    <p className="text-[10px] text-slate-400">{new Date(ord.updatedAt || ord.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderOrderHistory;