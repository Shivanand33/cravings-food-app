import React, { useState } from "react";
import api from "../../../config/Api";
import toast from "react-hot-toast";

const ViewReceivedOrder = ({ order, onClose }) => {
  const [status, setStatus] = useState(order.status || "pending");

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.patch(
        `/restaurant/orders/${order._id}/updateorderstatus?status=${newStatus}`,
      );
      toast.success(res.data.message);
      onClose();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        {order && (
          <div>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Order Number:</span>{" "}
              {order.orderNumber || order._id?.substring(0, 8)}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Customer:</span>{" "}
              {order.userId?.fullName || "Unknown"}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {status || "Pending"}
              {status === "pending" && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition ml-2"
                  onClick={() => handleStatusChange("accepted")}
                >
                  Accept Order
                </button>
              )}
              {status === "accepted" && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition ml-2"
                  onClick={() => handleStatusChange("preparing")}
                >
                  Prepration Started
                </button>
              )}
              {status === "preparing" && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition ml-2"
                  onClick={() => handleStatusChange("ready")}
                >
                  Ready for Pickup
                </button>
              )}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Total Amount:</span> ₹
              {order.orderValue.total || 0}
            </p>
            <h3 className="font-bold text-lg mt-4 mb-2">Items:</h3>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 py-2">
                  <p className="text-gray-700 font-bold">{item.itemName || item.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity || 1} • Price: ₹{item.price}
                  </p>
                </div>
              ))
            ) : (
              <p>No items in this order.</p>
            )}

            <div className="mt-3">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                onClick={() => handleStatusChange("rejected")}
              >
                Reject Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReceivedOrder;