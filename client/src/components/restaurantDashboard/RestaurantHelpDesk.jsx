import React, { useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";
import { FaStore, FaQuestionCircle, FaPaperPlane, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const MANAGER_FAQS = [
  {
    q: "How do I add or update menu items and pricing?",
    a: "Navigate to the Menu tab in your dashboard. You can add new dishes with multi-image uploads, update item availability (Available/Unavailable), or edit pricing in real time."
  },
  {
    q: "What should I do if an ordered item is out of stock?",
    a: "You can update the item status to 'Unavailable' in your Menu tab. For active orders containing out-of-stock items, contact support or reject the order promptly."
  },
  {
    q: "How are restaurant payouts calculated and settled?",
    a: "Payouts are automatically calculated from completed delivered orders minus commission, and transferred directly to your registered bank account weekly."
  }
];

const RestaurantHelpDesk = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/public/new-contact", formData);
      toast.success(res.data.message || "Partner support ticket submitted!");
      setFormData({ fullName: "", email: "", mobileNumber: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans p-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
            🏪 Merchant Partner Help Desk
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Restaurant Partner Support</h2>
          <p className="text-xs text-slate-300">Dedicated assistance for kitchen managers and merchant partners.</p>
        </div>
        <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-bold text-orange-300 flex items-center gap-2">
          <FaPhoneAlt /> Priority Hotline: +91 1800-999-888
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Merchant FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <FaQuestionCircle className="text-orange-600" /> Merchant FAQs
          </h3>

          <div className="space-y-4">
            {MANAGER_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800">{faq.q}</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <FaStore className="text-orange-600" /> Contact Partner Manager
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Restaurant Manager Name</label>
              <input
                type="text"
                placeholder="Manager Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Registered Email</label>
                <input
                  type="email"
                  placeholder="restaurant@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Issue Description</label>
              <textarea
                rows={4}
                placeholder="Details regarding kitchen orders, menu listings, or payouts..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaPaperPlane />
              <span>{submitting ? "Sending..." : "Submit Ticket"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default RestaurantHelpDesk;