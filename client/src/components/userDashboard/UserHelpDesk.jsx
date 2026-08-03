import React, { useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";
import { FaQuestionCircle, FaHeadset, FaPaperPlane, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const FAQS = [
  {
    q: "How can I track my food order in real-time?",
    a: "Go to your Customer Dashboard -> Orders tab. You can view live updates (Accepted, Preparing, Picked Up, Delivered) for all active orders."
  },
  {
    q: "What if my food delivery is delayed?",
    a: "If your order exceeds the estimated delivery time, you can reach out to our 24/7 customer support line or submit a message below for priority assistance."
  },
  {
    q: "Can I cancel an order after placing it?",
    a: "Orders can be cancelled before the restaurant accepts and starts preparing your food. Check your active order status in the Orders tab."
  },
  {
    q: "How do refund credits work for failed online payments?",
    a: "If an online payment fails or is debited without order creation, refunds are automatically reversed to your original payment source within 3-5 business days."
  }
];

const UserHelpDesk = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post("/public/new-contact", formData);
      toast.success(res.data.message || "Support ticket submitted successfully!");
      setFormData({ fullName: "", email: "", mobileNumber: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Support Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
            🎧 24/7 Customer Support
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Need Help with Your Order?</h2>
          <p className="text-xs text-slate-300">Our customer care team is available round the clock to assist you.</p>
        </div>
        <div className="flex gap-4 text-xs font-bold">
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex items-center gap-2">
            <FaPhoneAlt className="text-orange-400" /> +91 1800-123-4567
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <FaQuestionCircle className="text-orange-600" /> Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                <h4 className="font-extrabold text-sm text-slate-800">{faq.q}</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <FaHeadset className="text-orange-600" /> Submit a Support Ticket
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile Number</label>
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
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Describe Your Issue</label>
              <textarea
                rows={4}
                placeholder="Details regarding your order, refund, or app feedback..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaPaperPlane />
              <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UserHelpDesk;