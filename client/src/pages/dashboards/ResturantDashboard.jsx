import React, { useState, useEffect } from "react";
import RestaurantSideBar from "../../components/restaurantDashboard/RestaurantSidebar";
import RestaurantOverview from "../../components/restaurantDashboard/RestaurantOverview";
import RestaurantProfile from "../../components/restaurantDashboard/RestaurantProfile";
import RestaurantMenu from "../../components/restaurantDashboard/RestaurantMenu";
import RestaurantOrders from "../../components/restaurantDashboard/RestaurantOrders";
import RestaurantEarnings from "../../components/restaurantDashboard/RestaurantEarnings";
import RestaurantHelpDesk from "../../components/restaurantDashboard/RestaurantHelpDesk";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

const RestaurantDashboard = () => {
  const { role, isLogin, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTabFromState = location?.state?.tab;
  const [active, setActive] = useState(activeTabFromState || "overview");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    if (location?.state?.tab) {
      setActive(location.state.tab);
    }
  }, [location?.state?.tab]);

  const tabTitles = {
    overview: "Restaurant Manager Overview",
    profile: "Restaurant Profile & Settings",
    menu: "Menu Dishes & Food Items",
    orders: "Live Kitchen Orders",
    earnings: "Revenue & Earnings Analytics",
    helpdesk: "Partner Support & Help Desk",
  };

  const userPhoto = typeof user?.photo === "string" ? user.photo : user?.photo?.url;

  if (role && role.toLowerCase() !== "manager") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-orange-50/50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
            ⚠️
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Access Denied</h2>
          <p className="text-sm text-slate-500">
            You are currently not logged in as a Restaurant Manager. Please sign in with a manager account.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-[#FF5722] hover:bg-[#e04818] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 flex overflow-hidden font-sans relative">

      {/* 🔴 Dark Overlay for Mobile View */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* 🟢 Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 bg-white border-r border-slate-200 transition-all duration-300 z-40 flex flex-col ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <RestaurantSideBar
          active={active}
          setActive={setActive}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </aside>

      {/* 🔵 Main Dashboard Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            {/* 📱 Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-[#FF5722] active:scale-95 transition"
              title="Open Menu"
            >
              <GiHamburgerMenu className="text-xl" />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                {tabTitles[active] || "Restaurant Partner Dashboard"}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Manage kitchen orders, dishes, restaurant settings & revenue
              </p>
            </div>
          </div>

          {/* Restaurant Profile Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">
                {user?.restaurantName !== "N/A" ? user?.restaurantName : user?.fullName || "Restaurant Manager"}
              </p>
              <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-extrabold uppercase">
                Restaurant Partner
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 text-white font-bold flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-orange-200">
              {userPhoto ? (
                <img src={userPhoto} alt={user?.restaurantName || "Restaurant"} className="w-full h-full object-cover" />
              ) : user?.restaurantName ? (
                user.restaurantName.charAt(0).toUpperCase()
              ) : (
                "🏪"
              )}
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="flex-1 overflow-y-auto bg-slate-50/60">
          {active === "overview" && <RestaurantOverview />}
          {active === "profile" && <RestaurantProfile />}
          {active === "menu" && <RestaurantMenu />}
          {active === "orders" && <RestaurantOrders />}
          {active === "earnings" && <RestaurantEarnings />}
          {active === "helpdesk" && <RestaurantHelpDesk />}
        </div>

      </main>

    </div>
  );
};

export default RestaurantDashboard;