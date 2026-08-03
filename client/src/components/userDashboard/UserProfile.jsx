import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from "./modals/EditProfileModal";
import UserImage from "../../assets/userImage.jpg";
import { FaCamera, FaMapLocationDot, FaWallet } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { BiSolidBank } from "react-icons/bi";
import api from "../../config/Api";
import toast from "react-hot-toast";
import ResetPasswordModal from "./modals/ResetPasswordModal";

const UserProfile = () => {
  const { user, setUser } = useAuth();
  console.log(user);

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [preview, setPreview] = useState("");
  const userPhoto = typeof user?.photo === "string" ? user.photo : user?.photo?.url;

  const changePhoto = async (photo) => {
    const form_Data = new FormData();
    form_Data.append("image", photo);

    try {
      const res = await api.patch("/user/changePhoto", form_Data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(res.data.message || "Photo updated successfully");
      setUser(res.data.data);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      setPreview("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unknown Error");
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

  const renderField = (label, value) => {
    let displayVal = value;
    if (typeof value === "object" && value !== null) {
      displayVal = value.url || value.number || value.id || "";
    }
    const hasVal = Boolean(displayVal && displayVal !== "N/A" && String(displayVal).trim() !== "");

    return (
      <div className="flex justify-between py-2 px-3 border-b border-gray-200 last:border-b-0 text-sm">
        <span className="text-gray-600 font-medium">{label}:</span>
        <span className="text-gray-900 font-semibold">
          {hasVal ? (
            String(displayVal)
          ) : (
            <span className="text-gray-400">Not provided</span>
          )}
        </span>
      </div>
    );
  };

  const getSafeVal = (val) => {
    if (!val || val === "N/A") return null;
    if (typeof val === "object") {
      const extracted = val.url || val.number || val.id;
      return extracted && extracted !== "N/A" ? String(extracted) : null;
    }
    return String(val);
  };

  return (
    <>
      <div className="bg-gray-50 rounded-2xl mt-2 p-4 sm:p-6 h-full overflow-y-auto space-y-6 font-sans">
        {/* Header Section with Photo and Basic Info */}
        <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-200/80">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Photo Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="border-4 border-orange-100 rounded-full w-36 h-36 overflow-hidden bg-slate-100 shadow-md">
                  <img
                    src={preview || userPhoto || UserImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-1 right-1 bg-orange-600 text-white p-2.5 rounded-full hover:bg-orange-700 cursor-pointer transition transform hover:scale-110 shadow-lg"
                  title="Upload profile picture"
                >
                  <FaCamera size={16} />
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-slate-400 text-xs mt-2 font-medium">
                Click camera icon to change photo
              </p>
            </div>

            {/* Basic Info Section */}
            <div className="flex-1 flex flex-col md:flex-row justify-between w-full gap-4">
              <div>
                <div className="mb-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1">
                    {user?.fullName || "Customer"}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide">
                      {user?.role || "customer"}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">
                      {getSafeVal(user?.isActive) || "Active"}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4 text-sm text-slate-700 font-medium">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold">Email:</span>
                    <span className="text-slate-900 font-semibold">{user?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold">Phone:</span>
                    <span className="text-slate-900 font-semibold">{user?.mobileNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold">Member Since:</span>
                    <span className="text-slate-900 font-semibold">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col justify-center gap-3">
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-bold text-xs shadow-md active:scale-95"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsResetPasswordModalOpen(true)}
                  className="px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition font-bold text-xs shadow-md active:scale-95"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-200/80">
          <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-500 rounded-full"></span>
            Personal Information
          </h2>
          <div className="space-y-1">
            {renderField("Date of Birth", user?.dob)}
            {renderField("Gender", user?.gender)}
            {renderField("Address", user?.address)}
            {renderField("City", user?.city)}
            {renderField("PIN Code", user?.pin)}
          </div>
        </div>

        {/* Geo Location Section */}
        {(getSafeVal(user?.geoLocation?.lat) || getSafeVal(user?.geoLocation?.lon)) && (
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-200/80">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <FaMapLocationDot className="text-orange-500" />
              Geo Location
            </h2>
            <div className="space-y-1">
              {renderField("Latitude", user?.geoLocation?.lat)}
              {renderField("Longitude", user?.geoLocation?.lon)}
            </div>
          </div>
        )}

        {/* Payment Details Section */}
        {(getSafeVal(user?.paymentDetails?.upi) || getSafeVal(user?.paymentDetails?.account_number)) && (
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-200/80">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <FaWallet className="text-orange-500" />
              Payment Details
            </h2>
            <div className="space-y-1">
              {renderField("UPI ID", user?.paymentDetails?.upi)}
              {renderField("Account Number", user?.paymentDetails?.account_number)}
              {renderField("IFSC Code", user?.paymentDetails?.ifs_Code)}
            </div>
          </div>
        )}

        {/* Documents Section */}
        {(getSafeVal(user?.documents?.uidai) || getSafeVal(user?.documents?.pan)) && (
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-200/80">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <FaFileAlt className="text-orange-500" />
              Documents
            </h2>
            <div className="space-y-1">
              {renderField("UIDAI (Aadhaar)", user?.documents?.uidai)}
              {renderField("PAN Card", user?.documents?.pan)}
            </div>
          </div>
        )}

        {/* Restaurant Info (for managers) */}
        {(getSafeVal(user?.restaurantName) || getSafeVal(user?.cuisine)) && (
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-200/80">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4">
              Restaurant Information
            </h2>
            <div className="space-y-1">
              {renderField("Restaurant Name", user?.restaurantName)}
              {renderField("Cuisine Type", user?.cuisine)}
            </div>
          </div>
        )}
      </div>

      {isEditProfileModalOpen && (
        <EditProfileModal onClose={() => setIsEditProfileModalOpen(false)} />
      )}

      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetPasswordModalOpen(false)}
        />
      )}
    </>
  );
};

export default UserProfile;