import React from "react";
import { TbChartTreemap, TbTransactionRupee } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { TiShoppingCart } from "react-icons/ti";
import { RiCustomerService2Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLogout, MdClose } from "react-icons/md";
import api from "../../config/Api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserSideBar = ({ active, setActive, isCollapsed, setIsCollapsed, setIsMobileOpen }) => {
  const { user, setUser, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const userPhoto = typeof user?.photo === "string" ? user.photo : user?.photo?.url;

  const menuItems = [
    { key: "overview", title: "Overview", icon: <TbChartTreemap className="text-xl" /> },
    { key: "profile", title: "Profile", icon: <ImProfile className="text-xl" /> },
    { key: "orders", title: "Orders", icon: <TiShoppingCart className="text-xl" /> },
    { key: "transactions", title: "Transactions", icon: <TbTransactionRupee className="text-xl" /> },
    { key: "helpdesk", title: "Help Desk", icon: <RiCustomerService2Fill className="text-xl" /> },
  ];

  const handleTabClick = (key) => {
    setActive(key);
    // Tab click hote hi mobile drawer automatically close ho jayega
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      toast.success(res?.data?.message || "Logged out successfully");
      setUser("");
      setIsLogin(false);
      sessionStorage.removeItem("CravingUser");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to logout");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-3 bg-white select-none">

      {/* 🔴 Top Section */}
      <div>
        {/* Header with Hamburger Toggle inside Sidebar */}
        <div className="flex items-center justify-between h-12 mb-2 px-1">

          {/* Logo & Title (Visible when expanded) */}
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden transition-all duration-300">
              <span className="font-extrabold text-slate-800 text-lg tracking-tight whitespace-nowrap">
                Craving<span className="text-[#FF5722]">.</span>
              </span>
              <span className="text-[10px] bg-orange-100 text-[#FF5722] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Customer
              </span>
            </div>
          )}

          {/* 🍔 Desktop Hamburger Toggle Button (Hide / Show Sidebar) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-[#FF5722] active:scale-95 transition mx-auto lg:mx-0"
            title={isCollapsed ? "Expand Sidebar" : "Hide Sidebar"}
          >
            <GiHamburgerMenu className="text-lg" />
          </button>

          {/* 📱 Mobile Close Button (X) */}
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 transition"
          >
            <MdClose className="text-xl" />
          </button>

        </div>

        {/* User Card inside Sidebar */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 p-2.5 mb-3 bg-orange-50/70 rounded-2xl border border-orange-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-orange-300 shadow-xs bg-white flex items-center justify-center font-bold text-orange-600">
              {userPhoto ? (
                <img src={userPhoto} alt={user.fullName || "User"} className="w-full h-full object-cover" />
              ) : (
                user?.fullName ? user.fullName.charAt(0).toUpperCase() : "👤"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-800 truncate">{user.fullName || "Customer"}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email || "Customer Portal"}</p>
            </div>
          </div>
        )}

        <hr className="border-slate-100 mb-4" />

        {/* 🟡 Navigation Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = active === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                title={isCollapsed ? item.title : ""}
                className={`relative flex items-center gap-3.5 w-full h-11 px-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${isActive
                  ? "bg-[#FF5722] text-white shadow-lg shadow-orange-500/25"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
              >
                {/* Icon Container */}
                <div className="transition-transform duration-200 group-hover:scale-110 shrink-0">
                  {item.icon}
                </div>

                {/* Title Text (Hidden when collapsed) */}
                {!isCollapsed && (
                  <span className="whitespace-nowrap tracking-wide truncate">
                    {item.title}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 🔵 Bottom Logout Action */}
      <div className="pt-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : ""}
          className={`flex items-center gap-3.5 w-full h-11 px-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition duration-200 ${isCollapsed ? "justify-center" : ""
            }`}
        >
          <MdLogout className="text-xl shrink-0" />
          {!isCollapsed && (
            <span className="whitespace-nowrap font-bold">Logout</span>
          )}
        </button>
      </div>

    </div>
  );
};

export default UserSideBar;