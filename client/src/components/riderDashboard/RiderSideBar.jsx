import React from "react";
import { TbChartTreemap } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { FaMotorcycle, FaHistory } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import api from "../../config/Api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RiderSideBar = ({ active, setActive, isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userPhoto = typeof user?.photo === "string" ? user.photo : user?.photo?.url;
  const isOnline = (user?.dutyStatus || "online") === "online";

  const menuItems = [
    { key: "overview", title: "Overview", icon: <TbChartTreemap className="text-xl" /> },
    { key: "profile", title: "Rider Profile", icon: <ImProfile className="text-xl" /> },
    { key: "current-order", title: "Current Orders", icon: <FaMotorcycle className="text-xl" /> },
    { key: "order-history", title: "Order History", icon: <FaHistory className="text-xl" /> },
  ];

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (err) {}
    if (logout) logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="p-3 flex flex-col justify-between h-full bg-white border-r border-slate-200 select-none">
      <div>
        <div className="flex items-center justify-between h-12 mb-2 px-1">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-extrabold text-slate-800 text-base tracking-tight whitespace-nowrap">
                Rider Partner<span className="text-orange-600">.</span>
              </span>
              <span className="text-[9px] bg-orange-100 text-orange-600 font-extrabold px-2 py-0.5 rounded-full uppercase">
                Zomato Partner
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600 active:scale-95 transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <GiHamburgerMenu className="text-lg" />
          </button>
        </div>

        {/* Rider Card inside Sidebar when expanded */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 p-2.5 mb-3 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-orange-500 shadow-xs bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-sm">
              {userPhoto ? (
                <img src={userPhoto} alt={user.fullName || "Rider"} className="w-full h-full object-cover" />
              ) : (
                user?.fullName ? user.fullName.charAt(0).toUpperCase() : "🛵"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-white truncate">{user.fullName || "Delivery Partner"}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                <span className="text-[10px] text-slate-300 font-bold uppercase">{isOnline ? "On Duty" : "Off Duty"}</span>
              </div>
            </div>
          </div>
        )}

        <hr className="border-slate-100 mb-4" />

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                title={isCollapsed ? item.title : ""}
                className={`flex items-center gap-3.5 w-full h-11 px-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-500/25 font-bold"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : ""}
          className={`flex items-center gap-3.5 w-full h-11 px-3 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <MdLogout className="text-xl shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default RiderSideBar;