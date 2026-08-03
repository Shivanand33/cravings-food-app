import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";
import Loading from "../Loading";
import ViewDetailsModal from "./modals/ViewDetailsModal";
import { useAuth } from "../../context/AuthContext";
import { FaMotorcycle, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const RiderCurrentOrder = () => {
  const { user } = useAuth();
  const [currentOrder, setCurrentOrder] = useState([]);
  const [availableOrder, setAvailableOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewdetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [riderLocation, setRiderLocation] = useState(user?.geoLocation || { lat: 23.2599, lon: 77.4126 });

  const statusBadgeClass = (status = "") => {
    if (["delivered"].includes(status)) return "bg-green-100 text-green-800";
    if (["cancelled", "rejected", "refused", "damaged"].includes(status)) {
      return "bg-red-100 text-red-800";
    }
    if (["ready", "pickedUp", "onTheWay"].includes(status)) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-yellow-100 text-yellow-800";
  };

  const fetchOngoingOrder = async () => {
    setIsLoading(true);
    try {
      let response = await api.get("/rider/ongoingOrder");
      if (response.data.data.length > 0) {
        setCurrentOrder(response.data.data);
        setAvailableOrder([]);
      } else {
        setCurrentOrder([]);
        response = await api.post("/rider/availableOrder", riderLocation);
        setAvailableOrder(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching current order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refershLocation();
  }, []);

  useEffect(() => {
    if (!viewdetailsModalOpen) {
      fetchOngoingOrder();
      const interval = setInterval(() => {
        fetchOngoingOrder();
      }, 1000 * 15);
      return () => clearInterval(interval);
    }
  }, [viewdetailsModalOpen]);

  const handleDirection = (toLocation) => {
    let to;
    if (toLocation === "restaurant") {
      to = currentOrder[0]?.restaurantId?.geoLocation;
    } else {
      to = currentOrder[0]?.userId?.geoLocation;
    }

    if (!to || !to.lat || !to.lon) {
      toast.error("Location coordinates not available");
      return;
    }

    const URL = `https://www.google.com/maps/dir/?api=1&origin=${riderLocation.lat},${riderLocation.lon}&destination=${to.lat},${to.lon}&travelmode=two-wheeler`;
    window.open(URL, "_blank");
  };

  const refershLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRiderLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          toast.success("GPS Location Refreshed");
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  };

  const handleStatusUpdate = async (orderId, nextStatus) => {
    try {
      const res = await api.patch(`/rider/updateorderstatus/${orderId}?status=${nextStatus}`);
      toast.success(res.data.message || `Order updated to ${nextStatus}`);
      fetchOngoingOrder();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center py-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-3xl p-6 space-y-6 font-sans">
      <div className="bg-white rounded-3xl shadow-xs p-6 border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Current Active Deliveries 🛵</h2>
            <p className="text-xs text-slate-500 font-medium">Manage your accepted orders and pickup routes</p>
          </div>
          <button
            onClick={refershLocation}
            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-orange-500/20"
          >
            Refresh GPS
          </button>
        </div>

        {/* Ongoing Accepted Orders Card */}
        {currentOrder.length > 0 && (
          <div className="space-y-4">
            {currentOrder.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Active Order</span>
                    <p className="text-lg font-black text-slate-900 font-mono">
                      {order.orderNumber || order._id}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${statusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-800">
                  <div>
                    <p className="text-slate-400 uppercase text-[10px]">Customer Name</p>
                    <p className="font-extrabold text-slate-900">{order.userId?.fullName || "Customer"}</p>
                    <p className="text-[11px] text-slate-500">{order.userId?.mobileNumber}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 uppercase text-[10px]">Pickup Restaurant</p>
                    <p className="font-extrabold text-slate-900">{order.restaurantId?.restaurantName || order.restaurantId?.fullName}</p>
                    <p className="text-[11px] text-slate-500">{order.restaurantId?.city}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 uppercase text-[10px]">Order Value</p>
                    <p className="font-extrabold text-emerald-600 text-sm">₹{order.orderValue?.total || 0}</p>
                    <p className="text-[11px] text-slate-500 uppercase">{order.orderValue?.paymentMethod}</p>
                  </div>
                </div>

                {/* Status Update & Navigation Actions */}
                <div className="pt-3 border-t border-blue-200/60 flex flex-wrap justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDirection("restaurant")}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <FaMapMarkerAlt className="text-orange-500" /> Map to Restaurant
                    </button>
                    <button
                      onClick={() => handleDirection("customer")}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <FaMapMarkerAlt className="text-blue-500" /> Map to Customer
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {order.status !== "pickedUp" && order.status !== "delivered" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "pickedUp")}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition"
                      >
                        Mark Picked Up 📦
                      </button>
                    )}

                    {order.status === "pickedUp" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "delivered")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition"
                      >
                        Mark Delivered ✅
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Available Orders Section */}
        {currentOrder.length === 0 && availableOrder.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              Available Delivery Requests Nearby
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[11px] tracking-wider text-left">
                    <th className="px-4 py-3">Order Number</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Restaurant</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Distance</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {availableOrder.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono text-orange-600 font-extrabold">
                        {order.orderNumber || order._id}
                      </td>
                      <td className="px-4 py-3">{order.userId?.fullName || "Customer"}</td>
                      <td className="px-4 py-3">{order.restaurantId?.restaurantName || order.restaurantId?.fullName || "Restaurant"}</td>
                      <td className="px-4 py-3 font-black text-slate-900">₹{order.orderValue?.total || 0}</td>
                      <td className="px-4 py-3 text-slate-500 font-medium">{order.distanceFromRider || 0} KM</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewDetailsModalOpen(true);
                          }}
                        >
                          Accept Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentOrder.length === 0 && availableOrder.length === 0 && (
          <div className="text-center text-slate-500 py-16 space-y-2">
            <div className="text-5xl">🛵</div>
            <p className="text-base font-bold">No active delivery requests right now</p>
            <p className="text-xs">We'll automatically notify you when new orders arrive near your location.</p>
          </div>
        )}
      </div>

      {viewdetailsModalOpen && selectedOrder && (
        <ViewDetailsModal
          order={selectedOrder}
          onClose={() => setViewDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RiderCurrentOrder;