import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { 
  FaRegTrashAlt, 
  FaSearch, 
  FaStar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaMinus, 
  FaShoppingBag, 
  FaArrowLeft,
  FaCheckCircle
} from "react-icons/fa";
import api from "../config/Api";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const DEFAULT_RESTAURANT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1200&auto=format&fit=crop&q=80",
];

const getRestaurantImage = (r) => {
  if (!r) return DEFAULT_RESTAURANT_IMAGES[0];
  let url = "";
  if (typeof r.photo === "string") {
    url = r.photo;
  } else if (r.photo && typeof r.photo === "object") {
    url = r.photo.url || r.photo.secure_url || "";
  }
  
  if (url.includes("cloudinary.com") || url.includes("images.unsplash.com")) {
    return url;
  }
  return DEFAULT_RESTAURANT_IMAGES[0];
};

const RestaurantDisplayMenu = () => {
  const { isLogin, role } = useAuth();
  const { cart, addToCart, updateQuantity, clearCart, getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // State data passed from OrderNow, or fallback
  const [restaurantData, setRestaurantData] = useState(location.state || null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'veg', 'non-veg'
  const [searchQuery, setSearchQuery] = useState("");

  const restaurantId = restaurantData?._id || searchParams.get("id");

  // Fetch restaurant details if accessed directly without state
  const loadRestaurantDetails = async () => {
    if (restaurantData) return;
    try {
      const res = await api.get("/public/allRestaurants");
      const list = res.data.data || [];
      const found = list.find((r) => r._id === restaurantId);
      if (found) {
        setRestaurantData(found);
      }
    } catch (err) {
      console.error("Failed to load restaurant:", err);
    }
  };

  const fetchMenuItems = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/public/restaurant/menu/${restaurantId}`);
      setMenuItems(res.data.data || []);
    } catch (error) {
      console.error("Fetch menu error:", error);
      toast.error(error?.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurantDetails();
    fetchMenuItems();
  }, [restaurantId]);

  const handleCheckout = () => {
    if (!isLogin) {
      toast.error("Please login to proceed with order");
      navigate("/login");
      return;
    }
    if (role !== "customer") {
      toast.error("Only Customer accounts can place orders");
      return;
    }
    navigate("/checkoutPage");
  };

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "veg" && item.type === "veg") ||
      (typeFilter === "non-veg" && item.type !== "veg");

    return matchesSearch && matchesType;
  });

  const getItemQuantity = (itemId) => {
    if (!cart || !cart.cartItem) return 0;
    const found = cart.cartItem.find((i) => i._id === itemId);
    return found ? found.quantity || 1 : 0;
  };

  if (!restaurantData && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Restaurant Not Found</h2>
        <p className="text-slate-500 mb-4">Please select a valid restaurant from the list.</p>
        <button
          onClick={() => navigate("/order-now")}
          className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-md hover:bg-orange-700 transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28 font-sans">
      
      {/* Top Banner & Header */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        {/* Cover Photo */}
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={getRestaurantImage(restaurantData)}
            alt={restaurantData?.restaurantName || "Restaurant Banner"}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        {/* Floating Content Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute bottom-6 left-0 right-0 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/order-now")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full transition mb-2"
            >
              <FaArrowLeft size={10} /> Back to Restaurants
            </button>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {restaurantData?.restaurantName !== "N/A"
                ? restaurantData?.restaurantName
                : restaurantData?.fullName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
              <span className="text-orange-400 font-bold uppercase tracking-wider">
                {restaurantData?.cuisine || "Multi-Cuisine"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-400" />
                {restaurantData?.city || "Local City"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <FaStar /> 4.5 Rating
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3">
            <FaClock className="text-amber-400" size={16} />
            <div>
              <p className="text-white font-bold">30-40 min</p>
              <p className="text-slate-300 text-[10px]">Estimated Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Filters Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Filter Toggles */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                typeFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Items ({menuItems.length})
            </button>
            <button
              onClick={() => setTypeFilter("veg")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                typeFilter === "veg"
                  ? "bg-green-600 text-white shadow-xs"
                  : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Veg Only
            </button>
            <button
              onClick={() => setTypeFilter("non-veg")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                typeFilter === "non-veg"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
              Non-Veg Only
            </button>
          </div>

          {/* Search Dish Input */}
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium focus:bg-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>

        </div>
      </div>

      {/* Main Menu List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loading />
          </div>
        ) : (
          <>
            {filteredMenuItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-12 space-y-3 shadow-xs">
                <div className="text-4xl">🍲</div>
                <h3 className="text-lg font-bold text-slate-800">No menu items found</h3>
                <p className="text-xs text-slate-500">
                  This restaurant hasn't listed dishes matching your filters yet.
                </p>
                <button
                  onClick={() => {
                    setTypeFilter("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMenuItems.map((item) => {
                  const qty = getItemQuantity(item._id);
                  const isVeg = item.type === "veg";
                  const imageSrc =
                    item.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 p-5 flex gap-4 items-start"
                    >
                      {/* Left: Dish Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-xs ${
                              isVeg ? "border-green-600" : "border-red-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isVeg ? "bg-green-600" : "bg-red-600"
                              }`}
                            />
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            {item.type}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-lg text-slate-800 leading-snug">
                          {item.itemName}
                        </h3>

                        <p className="text-sm font-black text-slate-900">
                          ₹{item.price}
                        </p>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                            ⏱️ {item.preparationTime}
                          </span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                            🍽️ {item.servingSize}
                          </span>
                        </div>
                      </div>

                      {/* Right: Image & Action Button */}
                      <div className="shrink-0 flex flex-col items-center gap-3">
                        <img
                          src={imageSrc}
                          alt={item.itemName}
                          className="w-28 h-28 object-cover rounded-2xl shadow-xs"
                        />

                        {/* Quantity / Add to Cart Button */}
                        {qty > 0 ? (
                          <div className="flex items-center bg-orange-600 text-white rounded-xl shadow-md overflow-hidden text-xs font-bold">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="px-2.5 py-1.5 hover:bg-orange-700 transition active:scale-95"
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="px-3 py-1 font-extrabold">{qty}</span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="px-2.5 py-1.5 hover:bg-orange-700 transition active:scale-95"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            disabled={item.availability !== "available"}
                            className={`px-5 py-2 text-xs font-black rounded-xl shadow-md transition active:scale-95 border ${
                              item.availability === "available"
                                ? "bg-white text-orange-600 border-orange-500 hover:bg-orange-50"
                                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            }`}
                          >
                            {item.availability === "available" ? "+ ADD" : "OUT OF STOCK"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart && cart.cartItem && cart.cartItem.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 w-full max-w-2xl border border-slate-800 flex items-center justify-between pointer-events-auto animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <FaShoppingBag size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {getItemCount()} items from restaurant
                </p>
                <p className="text-lg font-black text-white">
                  ₹{cart.cartValue?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCart}
                className="p-2 text-slate-400 hover:text-red-400 transition"
                title="Clear Cart"
              >
                <FaRegTrashAlt size={16} />
              </button>
              <button
                onClick={handleCheckout}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 transition active:scale-95 flex items-center gap-2"
              >
                <span>Checkout</span>
                <FaCheckCircle />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDisplayMenu;