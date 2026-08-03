import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaLock, 
  FaStore, 
  FaMotorcycle, 
  FaSmile 
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "customer", // Default role set to customer for better UX
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (validationError[name]) {
      setValidationError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role: role }));
    if (validationError.role) {
      setValidationError((prev) => ({ ...prev, role: "" }));
    }
  };

  const handleClearForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    });
    setValidationError({});
  };

  const validate = () => {
    let Error = {};

    if (formData.fullName.length < 3) {
      Error.fullName = "Name must be more than 3 characters";
    } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
      Error.fullName = "Name should only contain letters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      Error.email = "Please enter a valid email address";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      Error.mobileNumber = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.password.length < 6) {
        Error.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
        Error.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      Error.role = "Please select a role";
    }

    setValidationError(Error);
    return Object.keys(Error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const payload = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
      };
      const res = await api.post("/auth/register", payload);
      toast.success(res.data.message || "Registration Successful! Please login.");
      handleClearForm();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50/50 p-20 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Left Side - Image Section */}
        <div className="md:w-5/12 relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Food Background" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Satisfy Your Cravings</h2>
            <p className="text-gray-200">Join thousands of foodies and get the best dishes delivered to your doorstep.</p>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="md:w-7/12 p-8 md:p-12">
          <div className="text-left mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500 mt-1">Sign up to get started with your food journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection Cards */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "customer", label: "Customer", icon: <FaSmile size={20}/> },
                  { id: "partner", label: "Rider", icon: <FaMotorcycle size={20}/> },
                  { id: "manager", label: "Restaurant", icon: <FaStore size={20}/> }
                ].map((roleItem) => (
                  <div 
                    key={roleItem.id}
                    onClick={() => handleRoleSelect(roleItem.id)}
                    className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 
                      ${formData.role === roleItem.id 
                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" 
                        : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300"}`}
                  >
                    {roleItem.icon}
                    <span className="text-xs font-bold">{roleItem.label}</span>
                  </div>
                ))}
              </div>
              {validationError.role && <p className="text-xs text-red-500 mt-1">{validationError.role}</p>}
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${validationError.fullName ? "border-red-500" : "border-gray-100"}`}
                />
                {validationError.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{validationError.fullName}</p>}
              </div>

              {/* Email & Mobile Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${validationError.email ? "border-red-500" : "border-gray-100"}`}
                  />
                  {validationError.email && <p className="text-xs text-red-500 mt-1 ml-1">{validationError.email}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaPhoneAlt />
                  </div>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    maxLength="10"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${validationError.mobileNumber ? "border-red-500" : "border-gray-100"}`}
                  />
                   {validationError.mobileNumber && <p className="text-xs text-red-500 mt-1 ml-1">{validationError.mobileNumber}</p>}
                </div>
              </div>

              {/* Passwords Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${validationError.password ? "border-red-500" : "border-gray-100"}`}
                  />
                   {validationError.password && <p className="text-xs text-red-500 mt-1 ml-1">{validationError.password}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${validationError.confirmPassword ? "border-red-500" : "border-gray-100"}`}
                  />
                  {validationError.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{validationError.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center gap-4">
               <button
                type="button"
                onClick={handleClearForm}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;