import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EditRestaurantProfileModal from "./modals/EditRestaurantProfileModal";
import UserImage from "../../assets/userImage.jpg";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaWallet,
  FaStore,
  FaUtensils,
  FaEdit,
  FaCheckCircle,
  FaFileAlt,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";
import { BiSolidBank } from "react-icons/bi";
import api from "../../config/Api";
import toast from "react-hot-toast";
import ResetPasswordModal from "../userDashboard/modals/ResetPasswordModal";

const getStringVal = (val) => {
  if (!val || val === "N/A") return "";
  if (typeof val === "object") return val.url || val.number || val.id || "";
  return String(val);
};

const RestaurantProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const userPhoto = typeof user?.photo === "string" ? user.photo : user?.photo?.url;
  const isOpen = (user?.operatingStatus || "open") === "open";

  const changePhoto = async (photo) => {
    const formData = new FormData();
    formData.append("image", photo);

    try {
      toast.loading("Uploading restaurant photo...", { id: "uploadRestaurantPhoto" });
      const res = await api.patch("/restaurant/changePhoto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "Restaurant photo updated!", { id: "uploadRestaurantPhoto" });
      setUser(res.data.data);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      setPreview("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload photo", { id: "uploadRestaurantPhoto" });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newPhotoURL = URL.createObjectURL(file);
      setPreview(newPhotoURL);
      changePhoto(file);
    }
  };

  const toggleOperatingStatus = async () => {
    const newStatus = isOpen ? "closed" : "open";
    setIsUpdatingStatus(true);
    try {
      const res = await api.put("/restaurant/update", {
        fullName: user?.fullName || "Manager",
        email: user?.email,
        mobileNumber: user?.mobileNumber,
        city: user?.city !== "N/A" ? user?.city : "City",
        pin: user?.pin !== "N/A" ? user?.pin : "110001",
        restaurantName: user?.restaurantName !== "N/A" ? user?.restaurantName : "My Restaurant",
        operatingStatus: newStatus,
      });

      if (res.data?.data) {
        setUser(res.data.data);
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        toast.success(`Restaurant is now ${newStatus.toUpperCase()} FOR ORDERS`);
      }
    } catch (err) {
      toast.error("Failed to update restaurant operating status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const renderInfoRow = (label, val) => {
    const textVal = getStringVal(val);
    return (
      <div className="flex justify-between py-2 border-b border-slate-100 last:border-b-0 text-xs font-semibold">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900 font-bold">
          {textVal ? textVal : <span className="text-slate-400 font-normal">Not Provided</span>}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* 🔴 Top Restaurant Partner Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-orange-500/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Logo/Banner & Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            
            {/* Camera Upload Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-orange-500/80 bg-slate-800 overflow-hidden shadow-2xl shrink-0 flex items-center justify-center text-3xl font-black text-amber-400">
                {preview || userPhoto ? (
                  <img src={preview || userPhoto} alt={user?.restaurantName} className="w-full h-full object-cover" />
                ) : (
                  user?.restaurantName?.charAt(0)?.toUpperCase() || "🏪"
                )}
              </div>
              
              {/* Camera Icon Overlay */}
              <label
                htmlFor="restaurantPhotoInput"
                className="absolute bottom-1 right-1 bg-orange-600 hover:bg-orange-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg transform group-hover:scale-110 transition duration-200"
                title="Upload Restaurant Logo / Photo"
              >
                <FaCamera size={14} />
              </label>
              <input
                type="file"
                id="restaurantPhotoInput"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Name, Cuisine & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {user?.restaurantName !== "N/A" ? user?.restaurantName : "Restaurant Name"}
                </h1>
                <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                  🏪 Zomato Partner
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FaCheckCircle size={10} /> Verified Restaurant
                </span>
              </div>

              <p className="text-slate-300 text-xs font-medium flex items-center justify-center sm:justify-start gap-2">
                <span>🍽️ {getStringVal(user?.cuisine) || "Multi-Cuisine"}</span>
                <span>•</span>
                <span>👤 Manager: {user?.fullName}</span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <FaEnvelope className="text-orange-400" /> {user?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaPhoneAlt className="text-orange-400" /> {user?.mobileNumber}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-orange-400" /> {getStringVal(user?.city) || "India"}
                </span>
              </div>
            </div>

          </div>

          {/* Operating Status Switch & Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto">
            
            {/* Open / Closed Toggle Card */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-4 w-full sm:w-auto">
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase text-slate-300 tracking-wider">Restaurant Status</p>
                <p className={`text-xs font-black ${isOpen ? "text-emerald-400" : "text-red-400"}`}>
                  {isOpen ? "🟢 OPEN FOR ORDERS" : "🔴 CLOSED FOR ORDERS"}
                </p>
              </div>
              <button
                onClick={toggleOperatingStatus}
                disabled={isUpdatingStatus}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isOpen ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isOpen ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsEditProfileModalOpen(true)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit Restaurant Profile
              </button>
              <button
                onClick={() => setIsResetPasswordModalOpen(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition shadow-md"
              >
                Reset Password
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 🔵 Detailed Restaurant Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Restaurant Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
              <FaStore />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Restaurant Information</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("Restaurant Name", user?.restaurantName)}
            {renderInfoRow("Cuisine Type", user?.cuisine)}
            {renderInfoRow("Manager Name", user?.fullName)}
            {renderInfoRow("Contact Mobile", user?.mobileNumber)}
            {renderInfoRow("Contact Email", user?.email)}
            {renderInfoRow("Operating City", user?.city)}
            {renderInfoRow("PIN Code", user?.pin)}
            {renderInfoRow("Street Address", user?.address)}
          </div>
        </div>

        {/* Card 2: Regulatory & Business Licenses */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
              <FaFileAlt />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Business & Licenses</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("FSSAI License No.", user?.documents?.fssai)}
            {renderInfoRow("GSTIN Certificate", user?.documents?.gst)}
            {renderInfoRow("PAN Number", user?.documents?.pan)}
            {renderInfoRow("UIDAI (Owner Aadhaar)", user?.documents?.uidai)}
          </div>
        </div>

        {/* Card 3: Bank & Settlement Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
              <BiSolidBank />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Bank & Settlement Account</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("UPI ID", user?.paymentDetails?.upi)}
            {renderInfoRow("Account Number", user?.paymentDetails?.account_number)}
            {renderInfoRow("IFSC Code", user?.paymentDetails?.ifs_Code)}
          </div>
        </div>

        {/* Card 4: GPS Geo Location */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">
              <FaMapMarkerAlt />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">GPS Geo Coordinates</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("Latitude", user?.geoLocation?.lat)}
            {renderInfoRow("Longitude", user?.geoLocation?.lon)}
          </div>
        </div>

        {/* Card 5: Account Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold">
              <FaCalendarAlt />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Account Metadata & ID</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-semibold">Restaurant Partner ID:</span>
              <p className="font-mono text-slate-900 font-extrabold mt-0.5">{user?._id}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Registration Date:</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Restaurant Modal */}
      {isEditProfileModalOpen && (
        <EditRestaurantProfileModal
          onClose={() => setIsEditProfileModalOpen(false)}
        />
      )}

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetPasswordModalOpen(false)}
        />
      )}

    </div>
  );
};

export default RestaurantProfile;