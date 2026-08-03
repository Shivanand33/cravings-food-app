import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import Loading from "../Loading";
import { FaRupeeSign, FaCreditCard, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const UserTransections = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/user/placedorders");
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Transactions 💳</h2>
            <p className="text-xs text-slate-500 font-medium">History of all payment charges for your food orders</p>
          </div>
          <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1.5 rounded-full">
            {orders.length} Completed Records
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">🧾</div>
            <h3 className="text-lg font-bold text-slate-800">No transactions recorded</h3>
            <p className="text-xs text-slate-500">Payments will appear here after you place food orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[11px] tracking-wider text-left">
                  <th className="px-4 py-3">Transaction / Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono text-orange-600 font-extrabold">
                      {ord.orderNumber || ord._id}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 capitalize flex items-center gap-1.5 text-slate-700">
                      {ord.orderValue?.paymentMethod === "cod" ? (
                        <>
                          <FaMoneyBillWave className="text-green-600" /> Cash on Delivery
                        </>
                      ) : (
                        <>
                          <FaCreditCard className="text-orange-600" /> Online Payment
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-800">
                        <FaCheckCircle size={10} /> {ord.orderValue?.paymentStatus || "Paid"}
                      </span>
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

export default UserTransections;