import React, { useState } from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { FaKey, FaEnvelope, FaShieldAlt, FaTimes } from "react-icons/fa";
import api from "../../config/Api";
import toast from "react-hot-toast";

const ForgetPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    cfNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isOtpSent && isOtpVerified && formData.newPassword !== formData.cfNewPassword) {
      toast.error("New Password and Confirm Password must match");
      setLoading(false);
      return;
    }

    try {
      let res;
      if (isOtpSent) {
        if (isOtpVerified) {
          res = await api.post("/auth/forgetPasword", formData);
          toast.success(res.data.message || "Password updated successfully!");
          onClose();
        } else {
          res = await api.post("/auth/verifyOtp", formData);
          toast.success(res.data.message || "OTP verified successfully!");
          setIsOtpVerified(true);
        }
      } else {
        res = await api.post("/auth/genOtp", formData);
        toast.success(res.data.message || "OTP sent to your email!");
        setIsOtpSent(true);
      }
    } catch (error) {
      console.error("Forget password error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-orange-950 p-6 text-white flex justify-between items-center relative">
          <div className="space-y-1">
            <span className="text-[10px] bg-orange-500/20 text-orange-400 font-black uppercase px-2.5 py-0.5 rounded-full border border-orange-500/30">
              Account Recovery
            </span>
            <h2 className="text-xl font-black">Reset Password</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-400">
          <span className={!isOtpSent ? "text-orange-600 font-black" : "text-emerald-600"}>
            1. Email
          </span>
          <span>→</span>
          <span className={isOtpSent && !isOtpVerified ? "text-orange-600 font-black" : isOtpVerified ? "text-emerald-600" : ""}>
            2. Verify OTP
          </span>
          <span>→</span>
          <span className={isOtpVerified ? "text-orange-600 font-black" : ""}>
            3. New Password
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">
              Registered Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isOtpSent}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition disabled:opacity-60"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {isOtpSent && (
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">
                Enter 6-Digit OTP *
              </label>
              <div className="relative">
                <FaShieldAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  disabled={isOtpVerified}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition disabled:opacity-60 font-mono tracking-widest"
                  placeholder="Enter OTP from email"
                />
              </div>
            </div>
          )}

          {isOtpSent && isOtpVerified && (
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="password"
                    name="cfNewPassword"
                    value={formData.cfNewPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="animate-spin">
                    <BsArrowClockwise size={16} />
                  </span>
                  <span>Processing...</span>
                </>
              ) : isOtpSent ? (
                isOtpVerified ? (
                  "Update Password"
                ) : (
                  "Verify OTP"
                )
              ) : (
                "Send OTP to Email"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ForgetPasswordModal;