import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaHeadset } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/public/new-contact", formData);
      toast.success(res.data.message || "Message sent successfully!");
      handleClearForm();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block bg-orange-100 text-orange-600 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            💬 Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Have questions about your order, restaurant partnerships, or rider opportunities? Contact us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-orange-400">Headquarters</span>
                <h3 className="text-2xl font-black">Creavings Support Hub</h3>
                <p className="text-xs text-slate-300">Available 24 hours a day, 7 days a week.</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-medium pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-orange-400 shrink-0">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Office Address</p>
                    <p className="text-slate-300">Raj Institute of Coding, Main Road, Bhopal, MP 462001</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-orange-400 shrink-0">
                    <FaPhoneAlt size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Support Hotline</p>
                    <p className="text-slate-300">+91 1800-123-4567 (Toll Free)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-orange-400 shrink-0">
                    <FaEnvelope size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Email Us</p>
                    <p className="text-slate-300">support@creavings.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-orange-400 shrink-0">
                    <FaClock size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Operational Hours</p>
                    <p className="text-slate-300">Mon - Sun: 8:00 AM - 2:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tip Box */}
            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex items-start gap-3 text-xs text-orange-950 font-medium">
              <FaHeadset className="text-orange-600 shrink-0 text-xl" />
              <div>
                <p className="font-bold text-sm">Need immediate order help?</p>
                <p className="text-slate-600 mt-0.5">
                  If you have an active order, please use the Help Desk in your Customer Dashboard for faster real-time resolution.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Send Us a Message</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Fill in your details below and we will respond within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} onReset={handleClearForm} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="10-digit mobile"
                    maxLength="10"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Message</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition disabled:opacity-50"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="reset"
                  disabled={isLoading}
                  className="px-6 py-3.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaPaperPlane />
                  <span>{isLoading ? "Sending..." : "Submit Message"}</span>
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Embedded Map Section */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xl overflow-hidden space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <FaMapMarkerAlt className="text-orange-600" />
            <span>Find Us On Map</span>
          </div>
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-inner">
            <iframe
              title="Creavings Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3483.9331294936896!2d77.45477337509959!3d23.268962679001856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c6967f58e0dbf%3A0x65d0724cf8368e2d!2sRICR%20-%20Raj%20Institute%20of%20Coding%20%26%20Robotics%20%7C%20Best%20Java%20Coding%20Classes%20In%20Bhopal!5e1!3m2!1sen!2sin!4v1770470878471!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;