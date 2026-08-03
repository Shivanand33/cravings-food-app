import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EditRiderProfileModal from "./modals/EditRiderProfileModal";
import api from "../../config/Api";
import toast from "react-hot-toast";
import { 
  FaUser, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMotorcycle, 
  FaIdCard, 
  FaMapMarkerAlt, 
  FaCamera, 
  FaWallet, 
  FaShieldAlt, 
  FaStar, 
  FaCheckCircle, 
  FaEdit,
  FaCalendarAlt,
  FaBolt,
  FaLock
} from "react-icons/fa";

const getStringVal = (val) => {
  if (!val || val === "N/A") return "";
  if (typeof val === "object") return val.url || val.number || val.id || "";
  return String(val);
};

const RiderProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const userPhoto = typeof user?.photo === "string" ? user.photo : user?.photo?.url;
  const isOnline = (user?.dutyStatus || "online") === "online";

  const changePhoto = async (photo) => {
    const formData = new FormData();
    formData.append("image", photo);

    try {
      toast.loading("Uploading photo...", { id: "uploadPhoto" });
      const res = await api.patch("/user/changePhoto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "Profile photo updated!", { id: "uploadPhoto" });
      setUser(res.data.data);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      setPreview("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload photo", { id: "uploadPhoto" });
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

  const toggleDutyStatus = async () => {
    const newStatus = isOnline ? "offline" : "online";
    setIsUpdatingStatus(true);
    try {
      const res = await api.put("/user/update", {
        fullName: user?.fullName || "Rider",
        email: user?.email,
        mobileNumber: user?.mobileNumber,
        city: user?.city !== "N/A" ? user?.city : "City",
        pin: user?.pin !== "N/A" ? user?.pin : "110001",
        dutyStatus: newStatus,
      });

      if (res.data?.data) {
        setUser(res.data.data);
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        toast.success(`Duty status changed to ${newStatus.toUpperCase()}`);
      }
    } catch (err) {
      toast.error("Failed to update duty status");
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
      
      {/* 🔴 Top Delivery Partner Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-orange-500/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Profile Photo & Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            
            {/* Camera Upload Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-orange-500/80 bg-slate-800 overflow-hidden shadow-2xl shrink-0 flex items-center justify-center text-3xl font-black text-amber-400">
                {preview || userPhoto ? (
                  <img src={preview || userPhoto} alt={user?.fullName} className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0)?.toUpperCase() || "🛵"
                )}
              </div>
              
              {/* Camera Icon Overlay */}
              <label
                htmlFor="riderPhotoInput"
                className="absolute bottom-1 right-1 bg-orange-600 hover:bg-orange-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg transform group-hover:scale-110 transition duration-200"
                title="Change Profile Photo"
              >
                <FaCamera size={14} />
              </label>
              <input
                type="file"
                id="riderPhotoInput"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Name, Badges & Joined Date */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {user?.fullName || "Rider Partner"}
                </h1>
                <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                  🛵 Delivery Partner
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FaCheckCircle size={10} /> Verified Rider
                </span>
              </div>

              <p className="text-slate-300 text-xs font-medium flex items-center justify-center sm:justify-start gap-2">
                <span>📧 {user?.email}</span>
                <span>•</span>
                <span>📞 {user?.mobileNumber}</span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-orange-400" /> Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-IN")}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-orange-400" /> {getStringVal(user?.city) || "India"}
                </span>
              </div>
            </div>

          </div>

          {/* Duty Status Switch & Edit Button */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto">
            
            {/* Online / Offline Toggle Card */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-4 w-full sm:w-auto">
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase text-slate-300 tracking-wider">Duty Status</p>
                <p className={`text-xs font-black ${isOnline ? "text-emerald-400" : "text-slate-400"}`}>
                  {isOnline ? "🟢 ON DUTY (Online)" : "🔴 OFF DUTY (Offline)"}
                </p>
              </div>
              <button
                onClick={toggleDutyStatus}
                disabled={isUpdatingStatus}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isOnline ? "bg-emerald-500" : "bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isOnline ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <FaEdit /> Edit Rider Profile
            </button>

          </div>

        </div>
      </div>

      {/* 🟢 Rider Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Rating */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl shrink-0">
            <FaStar />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Rating</p>
            <p className="text-lg font-black text-slate-900">4.9 / 5.0</p>
          </div>
        </div>

        {/* Deliveries */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl shrink-0">
            <FaMotorcycle />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Deliveries</p>
            <p className="text-lg font-black text-slate-900">120+ Orders</p>
          </div>
        </div>

        {/* On-Time Rate */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">
            <FaBolt />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">On-Time Rate</p>
            <p className="text-lg font-black text-slate-900">98.5%</p>
          </div>
        </div>

        {/* Safety Badge */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0">
            <FaShieldAlt />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Safety Grade</p>
            <p className="text-lg font-black text-slate-900">Class A</p>
          </div>
        </div>

      </div>

      {/* 🔵 Detailed Profile Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Personal Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
              <FaUser />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Personal Information</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("Full Name", user?.fullName)}
            {renderInfoRow("Email Address", user?.email)}
            {renderInfoRow("Mobile Phone", user?.mobileNumber)}
            {renderInfoRow("Gender", user?.gender)}
            {renderInfoRow("Date of Birth", user?.dob)}
            {renderInfoRow("Operating City", user?.city)}
            {renderInfoRow("PIN Code", user?.pin)}
            {renderInfoRow("Full Address", user?.address)}
          </div>
        </div>

        {/* Card 2: Vehicle Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
              <FaMotorcycle />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Vehicle Details</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("Vehicle Type", user?.vehicleDetails?.vehicleType || "Bike")}
            {renderInfoRow("Plate Number", user?.vehicleDetails?.vehicleNumber)}
            {renderInfoRow("Vehicle Model", user?.vehicleDetails?.vehicleModel)}
          </div>
        </div>

        {/* Card 3: Driving & KYC Documents */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
              <FaIdCard />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Driving & KYC Documents</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("Driving License (DL)", user?.documents?.dl)}
            {renderInfoRow("Registration (RC)", user?.documents?.rc)}
            {renderInfoRow("Aadhaar (UIDAI)", user?.documents?.uidai)}
            {renderInfoRow("PAN Card", user?.documents?.pan)}
          </div>
        </div>

        {/* Card 4: Bank & Payout Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
              <FaWallet />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Bank & Payout Account</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("UPI ID", user?.paymentDetails?.upi)}
            {renderInfoRow("Account Number", user?.paymentDetails?.account_number)}
            {renderInfoRow("IFSC Code", user?.paymentDetails?.ifs_Code)}
          </div>
        </div>

        {/* Card 5: Emergency Safety Contact */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
              <FaPhoneAlt />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Emergency Safety Contact</h3>
          </div>
          <div className="space-y-1">
            {renderInfoRow("Contact Name", user?.emergencyContact?.name)}
            {renderInfoRow("Phone Number", user?.emergencyContact?.phone)}
            {renderInfoRow("Relationship", user?.emergencyContact?.relation)}
          </div>
        </div>

        {/* Card 6: GPS Geo Location */}
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

      </div>

      {/* Edit Rider Profile Modal */}
      {isEditModalOpen && (
        <EditRiderProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}

    </div>
  );
};

export default RiderProfile;