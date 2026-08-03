import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/Api";
import toast from "react-hot-toast";
import { FaUser, FaMotorcycle, FaIdCard, FaWallet, FaPhoneAlt, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const getStringVal = (val) => {
  if (!val || val === "N/A") return "";
  if (typeof val === "object") return val.url || val.number || val.id || "";
  return String(val);
};

const EditRiderProfileModal = ({ onClose }) => {
  const { user, setUser, setIsLogin } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: getStringVal(user?.fullName),
    email: getStringVal(user?.email),
    mobileNumber: getStringVal(user?.mobileNumber),
    gender: getStringVal(user?.gender) || "male",
    dob: getStringVal(user?.dob),
    address: getStringVal(user?.address),
    city: getStringVal(user?.city),
    pin: getStringVal(user?.pin),
    dutyStatus: getStringVal(user?.dutyStatus) || "online",
    vehicleDetails: {
      vehicleType: getStringVal(user?.vehicleDetails?.vehicleType) || "Bike",
      vehicleNumber: getStringVal(user?.vehicleDetails?.vehicleNumber),
      vehicleModel: getStringVal(user?.vehicleDetails?.vehicleModel),
    },
    emergencyContact: {
      name: getStringVal(user?.emergencyContact?.name),
      phone: getStringVal(user?.emergencyContact?.phone),
      relation: getStringVal(user?.emergencyContact?.relation),
    },
    documents: {
      dl: getStringVal(user?.documents?.dl),
      rc: getStringVal(user?.documents?.rc),
      uidai: getStringVal(user?.documents?.uidai),
      pan: getStringVal(user?.documents?.pan),
    },
    paymentDetails: {
      upi: getStringVal(user?.paymentDetails?.upi),
      account_number: getStringVal(user?.paymentDetails?.account_number),
      ifs_Code: getStringVal(user?.paymentDetails?.ifs_Code),
    },
    geoLocation: {
      lat: getStringVal(user?.geoLocation?.lat),
      lon: getStringVal(user?.geoLocation?.lon),
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.pin.trim()) {
      newErrors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pin)) {
      newErrors.pin = "PIN code must be 6 digits";
    }

    if (
      formData.documents.pan &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.documents.pan.toUpperCase())
    ) {
      newErrors.pan = "Invalid PAN format (e.g. ABCDE1234F)";
    }

    if (
      formData.paymentDetails.upi &&
      !/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(formData.paymentDetails.upi)
    ) {
      newErrors.upi = "Invalid UPI format (e.g. name@upi)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const fetchLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      toast.loading("Fetching live location...", { id: "geoLoc" });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            geoLocation: {
              lat: String(pos.coords.latitude),
              lon: String(pos.coords.longitude),
            },
          }));
          toast.success("Location updated!", { id: "geoLoc" });
        },
        () => {
          toast.error("Failed to get location", { id: "geoLoc" });
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please resolve validation errors first.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.put("/user/update", formData);
      if (res.data?.data) {
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        setIsLogin(true);
        toast.success("Rider profile updated successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update rider profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans border border-slate-100">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-xl font-bold shadow-md">
              🛵
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Edit Delivery Partner Profile</h2>
              <p className="text-xs text-slate-400">Update your vehicle, KYC documents, payouts & emergency info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Personal Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <FaUser className="text-orange-600" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className={`w-full p-2.5 bg-white border rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 ${
                    errors.fullName ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="Rider Full Name"
                />
                {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full p-2.5 bg-slate-200/60 border border-slate-200 rounded-xl font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  className={`w-full p-2.5 bg-white border rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 ${
                    errors.mobileNumber ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="10-digit phone"
                />
                {errors.mobileNumber && <p className="text-red-500 text-[10px] mt-1">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={`w-full p-2.5 bg-white border rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 ${
                    errors.city ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="Operating City"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="Locality, House No., Street"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  maxLength="6"
                  required
                  className={`w-full p-2.5 bg-white border rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 ${
                    errors.pin ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="6-digit PIN"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <FaMotorcycle className="text-orange-600" /> Vehicle Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
                <select
                  value={formData.vehicleDetails.vehicleType}
                  onChange={(e) => handleNestedChange("vehicleDetails", "vehicleType", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                >
                  <option value="Bike">🏍️ Motorbike</option>
                  <option value="Scooter">🛵 Scooter / Scooty</option>
                  <option value="Electric Vehicle">⚡ Electric Scooter (EV)</option>
                  <option value="Cycle">🚲 Bicycle</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Plate Number</label>
                <input
                  type="text"
                  value={formData.vehicleDetails.vehicleNumber}
                  onChange={(e) => handleNestedChange("vehicleDetails", "vehicleNumber", e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 uppercase"
                  placeholder="e.g. UP65 AB 1234"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Model Name</label>
                <input
                  type="text"
                  value={formData.vehicleDetails.vehicleModel}
                  onChange={(e) => handleNestedChange("vehicleDetails", "vehicleModel", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Honda Activa 6G"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Driving & KYC Documents */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <FaIdCard className="text-orange-600" /> Driving & KYC Documents
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Driving License (DL) Number</label>
                <input
                  type="text"
                  value={formData.documents.dl}
                  onChange={(e) => handleNestedChange("documents", "dl", e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 uppercase"
                  placeholder="e.g. DL-1420110012345"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registration Certificate (RC) Number</label>
                <input
                  type="text"
                  value={formData.documents.rc}
                  onChange={(e) => handleNestedChange("documents", "rc", e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 uppercase"
                  placeholder="e.g. RC-987654321"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar (UIDAI) Number</label>
                <input
                  type="text"
                  value={formData.documents.uidai}
                  onChange={(e) => handleNestedChange("documents", "uidai", e.target.value)}
                  maxLength="12"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="12-digit Aadhaar Number"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PAN Card Number</label>
                <input
                  type="text"
                  value={formData.documents.pan}
                  onChange={(e) => handleNestedChange("documents", "pan", e.target.value.toUpperCase())}
                  maxLength="10"
                  className={`w-full p-2.5 bg-white border rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 uppercase ${
                    errors.pan ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="e.g. ABCDE1234F"
                />
                {errors.pan && <p className="text-red-500 text-[10px] mt-1">{errors.pan}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Bank & Payout Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <FaWallet className="text-orange-600" /> Bank & Payout Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">UPI ID for Payouts</label>
                <input
                  type="text"
                  value={formData.paymentDetails.upi}
                  onChange={(e) => handleNestedChange("paymentDetails", "upi", e.target.value)}
                  className={`w-full p-2.5 bg-white border rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 ${
                    errors.upi ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="e.g. rider@upi"
                />
                {errors.upi && <p className="text-red-500 text-[10px] mt-1">{errors.upi}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.paymentDetails.account_number}
                  onChange={(e) => handleNestedChange("paymentDetails", "account_number", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="Bank Account No."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.paymentDetails.ifs_Code}
                  onChange={(e) => handleNestedChange("paymentDetails", "ifs_Code", e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500 uppercase"
                  placeholder="e.g. SBIN0001234"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Emergency Contact */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <FaPhoneAlt className="text-orange-600" /> Emergency Safety Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleNestedChange("emergencyContact", "name", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="Name of Relative / Friend"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Phone Number</label>
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleNestedChange("emergencyContact", "phone", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="10-digit phone"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  value={formData.emergencyContact.relation}
                  onChange={(e) => handleNestedChange("emergencyContact", "relation", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Father / Spouse / Brother"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Live Location Detection */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <FaMapMarkerAlt className="text-red-500 text-base" />
              <span>
                Live GPS Coordinates:{" "}
                <span className="font-mono text-slate-900 font-bold">
                  {formData.geoLocation.lat && formData.geoLocation.lon
                    ? `${formData.geoLocation.lat}, ${formData.geoLocation.lon}`
                    : "Not set"}
                </span>
              </span>
            </div>
            <button
              onClick={fetchLocation}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition"
            >
              Get Live GPS Location
            </button>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 font-extrabold text-xs rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Rider Profile"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditRiderProfileModal;
