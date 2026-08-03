import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/Api";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { 
  FaUsers, 
  FaUtensils, 
  FaMotorcycle, 
  FaShoppingBag, 
  FaRupeeSign, 
  FaShieldAlt, 
  FaChartLine, 
  FaUserCog,
  FaStore,
  FaCheckCircle,
  FaSearch,
  FaFileAlt
} from "react-icons/fa";

const AdminDashboard = () => {
  const { role, isLogin, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, ordersRes] = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/orders"),
      ]);

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data.data);
      }
      if (usersRes.status === "fulfilled") {
        setUsersList(usersRes.value.data.data || []);
      }
      if (ordersRes.status === "fulfilled") {
        setOrdersList(ordersRes.value.data.data || []);
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    fetchAdminData();
  }, [isLogin, navigate]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.patch(`/admin/userRole/${userId}`, { role: newRole });
      toast.success(res.data.message);
      fetchAdminData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
  };

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
            🛡️
          </div>
          <h2 className="text-2xl font-black text-slate-800">Admin Access Required</h2>
          <p className="text-sm text-slate-500 font-medium">
            You must be logged in as an Administrator to view platform analytics and user controls.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition"
          >
            Sign in as Admin
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const merchantList = usersList.filter((u) => u.role === "manager");

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans space-y-8">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="inline-block bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30">
            🛡️ System Control Center
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Platform metrics, multi-role user management, merchant verification & system order control.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/20 transition"
        >
          Refresh Platform Data
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: "overview", label: "Overview & Analytics", icon: <FaChartLine /> },
          { key: "users", label: "Users & Access Control", icon: <FaUserCog /> },
          { key: "merchants", label: "Restaurants & Merchants", icon: <FaStore /> },
          { key: "orders", label: "All Platform Orders", icon: <FaShoppingBag /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
              activeTab === tab.key
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                    <FaUsers />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400">Total Registered Users</p>
                  <p className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</p>
                  <p className="text-[11px] text-slate-500">{stats?.totalCustomers} Customers • {stats?.totalRestaurants} Restaurants • {stats?.totalRiders} Riders</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-xl">
                    <FaShoppingBag />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400">Total System Orders</p>
                  <p className="text-3xl font-black text-slate-900">{stats?.totalOrders || 0}</p>
                  <p className="text-[11px] text-slate-500">Across all platform restaurants</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
                    <FaRupeeSign />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400">Platform Revenue</p>
                  <p className="text-3xl font-black text-slate-900">₹{stats?.totalRevenue?.toFixed(2) || "0.00"}</p>
                  <p className="text-[11px] text-slate-500">From completed deliveries</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">
                    <FaUtensils />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400">Total Listed Menu Items</p>
                  <p className="text-3xl font-black text-slate-900">{stats?.totalMenuItems || 0}</p>
                  <p className="text-[11px] text-slate-500">Active restaurant menu dishes</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS & ACCESS CONTROL */}
          {activeTab === "users" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">All System Users</h2>
                  <p className="text-xs text-slate-500">Manage account roles and access permissions</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Role filter chips */}
                  {["all", "customer", "manager", "partner", "admin"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition ${
                        roleFilter === r
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}

                  <div className="relative w-full sm:w-48 mt-2 sm:mt-0">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[11px] tracking-wider text-left">
                      <th className="px-4 py-3">User Details</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Current Role</th>
                      <th className="px-4 py-3">Joined Date</th>
                      <th className="px-4 py-3 text-right">Change Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <p className="font-extrabold text-slate-900">{u.fullName}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">
                          {u.mobileNumber}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : u.role === "manager"
                                ? "bg-orange-100 text-orange-800"
                                : u.role === "partner"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-medium">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white outline-none cursor-pointer"
                          >
                            <option value="customer">Customer</option>
                            <option value="manager">Restaurant Manager</option>
                            <option value="partner">Rider Partner</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RESTAURANTS & MERCHANTS APPROVAL */}
          {activeTab === "merchants" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Registered Restaurants & Merchants ({merchantList.length})</h2>
                <p className="text-xs text-slate-500">Inspect merchant credentials, GST, FSSAI documents and status</p>
              </div>

              {merchantList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm font-bold">No restaurant merchants registered yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {merchantList.map((m) => (
                    <div key={m._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900">
                            {m.restaurantName !== "N/A" ? m.restaurantName : m.fullName}
                          </h3>
                          <p className="text-xs text-orange-600 font-bold uppercase">{m.cuisine !== "N/A" ? m.cuisine : "Multi-Cuisine"}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <FaCheckCircle size={10} /> Verified
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 font-medium">
                        <p><span className="font-bold text-slate-800">Owner:</span> {m.fullName} ({m.email})</p>
                        <p><span className="font-bold text-slate-800">Phone:</span> {m.mobileNumber}</p>
                        <p><span className="font-bold text-slate-800">Location:</span> {m.address !== "N/A" ? `${m.address}, ${m.city}` : m.city}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          GST: {m.documents?.gst || "N/A"}
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          FSSAI: {m.documents?.fssai || "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ALL PLATFORM ORDERS */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">All System Orders ({ordersList.length})</h2>
                <p className="text-xs text-slate-500">Live order activity across all restaurants and riders</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[11px] tracking-wider text-left">
                      <th className="px-4 py-3">Order Number</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Restaurant</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {ordersList.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono text-orange-600 font-extrabold">
                          {ord.orderNumber || ord._id}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-extrabold">{ord.userId?.fullName || "Customer"}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{ord.userId?.mobileNumber}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {ord.restaurantId?.restaurantName || ord.restaurantId?.fullName || "Restaurant"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800">
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-black text-slate-900">
                          ₹{ord.orderValue?.total?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
