import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ForgetPasswordModal from "../components/publicModals/ForgetPasswordModal";

const Login = () => {
  const { setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("customer");
  const [isForgetPasswordModelOpen, setIsForgetPasswordModelOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: selectedRole,
      };
      const res = await api.post("/auth/login", payload);
      toast.success(res.data.message);
      setUser(res.data.data);
      setIsLogin(true);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      handleClearForm();

      // Route based on role
      switch (res.data.data.role || selectedRole) {
        case "manager":
        case "restaurant":
          setRole("manager");
          navigate("/resturant-dashboard");
          break;
        case "partner":
        case "rider":
          setRole("partner");
          navigate("/rider-dashboard");
          break;
        case "customer":
          setRole("customer");
          navigate("/user-dashboard", { state: { tab: "overview" } });
          break;
        case "admin":
          setRole("admin");
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        
        {/* Main Card Container */}
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-orange-100">
          
          {/* Left Decorative Image Section */}
          <div className="relative min-h-[260px] md:min-h-full bg-slate-900 flex flex-col justify-between p-6 sm:p-8 text-white">
            {/* Background Image */}
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
              alt="Delicious Burger"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Top Badge */}
            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide">
                🍔 Craven FoodApp
              </span>
            </div>

            {/* Bottom Tagline */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Back to Flavor
              </h3>
              <p className="text-gray-300 text-sm">
                Log in to continue your food journey and taste the magic delivered hot to your doorstep.
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Log in to get started with your food journey
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                
                {/* Customer */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === "customer"
                      ? "border-[#FF5722] bg-orange-50/50 text-[#FF5722] font-semibold"
                      : "border-gray-100 bg-gray-50/50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">😊</span>
                  <span className="text-xs mt-1">Customer</span>
                </button>

                {/* Rider */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("rider")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === "rider"
                      ? "border-[#FF5722] bg-orange-50/50 text-[#FF5722] font-semibold"
                      : "border-gray-100 bg-gray-50/50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">🛵</span>
                  <span className="text-xs mt-1">Rider</span>
                </button>

                {/* Restaurant */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("restaurant")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === "restaurant"
                      ? "border-[#FF5722] bg-orange-50/50 text-[#FF5722] font-semibold"
                      : "border-gray-100 bg-gray-50/50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">🏪</span>
                  <span className="text-xs mt-1">Restaurant</span>
                </button>

              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-orange-500/20 text-sm transition"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-orange-500/20 text-sm transition"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgetPasswordModelOpen(true)}
                  className="text-xs font-semibold text-gray-600 hover:text-[#FF5722] transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClearForm}
                  disabled={isLoading}
                  className="w-1/3 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-50"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-[#FF5722] hover:bg-[#e04818] text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Loggin in...</span>
                    </>
                  ) : (
                    <span>Log In</span>
                  )}
                </button>
              </div>

              {/* Redirect to Signup */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-bold text-[#FF5722] hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>

            </form>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgetPasswordModelOpen && (
        <ForgetPasswordModal onClose={() => setIsForgetPasswordModelOpen(false)} />
      )}
    </>
  );
};

export default Login;