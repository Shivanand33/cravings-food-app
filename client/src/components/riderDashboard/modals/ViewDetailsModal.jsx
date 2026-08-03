import React from "react";
import api from "../../../config/Api";
import toast from "react-hot-toast";

const ViewDetailsModal = ({ order, onClose }) => {
  const handleAcceptOrder = async () => {
    try {
      const res = await api.patch(`/rider/acceptorder/${order._id}`);
      toast.success(res.data.message);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <p className="mb-2">
          Order Number: {order?.orderNumber || order?._id?.substring(0, 8)}
        </p>
        <p className="mb-2">Customer: {order?.userId?.fullName || "Unknown"}</p>
        <p className="mb-2">
          Restaurant:{" "}
          {order?.restaurantId?.restaurantName ||
            order?.restaurantId?.fullName ||
            "Unknown"}
        </p>
        <p className="mb-2">Total Amount: ₹{order?.orderValue?.total || 0}</p>
        <p className="mb-2">
          Resturant Distance: {order?.distanceFromRider || 0} KM
        </p>
        <p className="mb-2">Order Status: {order?.status || 0}</p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            Close
          </button>
          <button
            onClick={handleAcceptOrder}
            className="mt-4 bg-(--color-secondary) hover:bg-(--color-secondary-hover) text-white px-4 py-2 rounded-md transition"
          >
            Accept Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;