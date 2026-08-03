import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import Loading from "../components/Loading";
import { FaArrowRight, FaSearch, FaStar, FaMapMarkerAlt, FaUtensils, FaClock } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const CUISINES = [
  "All",
  "Indian",
  "Italian",
  "Chinese",
  "Fast Food",
  "Pan Asian",
  "North Indian",
  "South Indian",
  "Desserts",
];

const DEFAULT_RESTAURANT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
];

const getRestaurantImage = (r, idx) => {
  if (!r) return DEFAULT_RESTAURANT_IMAGES[idx % DEFAULT_RESTAURANT_IMAGES.length];
  let url = "";
  if (typeof r.photo === "string") {
    url = r.photo;
  } else if (r.photo && typeof r.photo === "object") {
    url = r.photo.url || r.photo.secure_url || "";
  }
  
  const badCloudinaryIDs = [
    "nwwu8ixgz58x0chskgy3",
    "u10yv8qhzuxfxm9wxhbm",
    "j5bf4emegzscfgrkbj3s",
    "wwmo9zfwzl4ranydjssu",
    "dice",
    "cricket",
    "vector",
    "stickman",
    "localhost",
    "uploads"
  ];

  const lower = url.toLowerCase();
  const isBadImage = !url || url === "N/A" || badCloudinaryIDs.some((bad) => lower.includes(bad));

  if (isBadImage) {
    return DEFAULT_RESTAURANT_IMAGES[idx % DEFAULT_RESTAURANT_IMAGES.length];
  }

  if (url.includes("cloudinary.com") || url.includes("images.unsplash.com")) {
    return url;
  }

  return DEFAULT_RESTAURANT_IMAGES[idx % DEFAULT_RESTAURANT_IMAGES.length];
};

const OrderNow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const fetchAllRestaurants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/public/allRestaurants");
      setRestaurants(res.data.data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error(error?.response?.data?.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRestaurants();
  }, []);

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleRestaurantClick = (restaurantInfo) => {
    navigate("/restaurantMenu", { state: restaurantInfo });
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "All" ||
      r.cuisine?.toLowerCase().includes(selectedCuisine.toLowerCase());

    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
              🛵 Direct Delivery to your Doorstep
            </span>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              Discover Great Food & Top Restaurants
            </h1>
            <p className="text-orange-100 text-sm sm:text-base">
              Explore menus, reviews, ratings, and order from the best dining spots near you.
            </p>

            {/* Search Input Bar */}
            <div className="pt-2">
              <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl text-slate-800">
                <FaSearch className="text-gray-400 ml-3 shrink-0" size={18} />
                <input
                  type="text"
                  placeholder="Search restaurant name, cuisine, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base outline-none bg-transparent font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Background Accent */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Cuisine Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <FaUtensils size={12} /> Cuisines:
          </span>
          {CUISINES.map((cuisine) => {
            const isActive = selectedCuisine === cuisine;
            return (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-xs ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md shadow-orange-500/30 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {cuisine}
              </button>
            );
          })}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loading />
          </div>
        ) : (
          <>
            {/* Results Count Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                {selectedCuisine !== "All" ? `${selectedCuisine} Restaurants` : "Available Restaurants"}
              </h2>
              <span className="text-xs sm:text-sm text-slate-500 font-semibold bg-white px-3 py-1.5 rounded-full border border-slate-200">
                Showing {filteredRestaurants.length} places
              </span>
            </div>

            {/* Restaurants Grid */}
            {filteredRestaurants.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4 max-w-md mx-auto my-12">
                <div className="text-5xl">🍽️</div>
                <h3 className="text-xl font-bold text-slate-800">No restaurants found</h3>
                <p className="text-sm text-slate-500">
                  Try adjusting your search criteria or clear filters to see all available restaurants.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCuisine("All");
                  }}
                  className="px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-orange-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map((r, idx) => {
                  const coverImage = getRestaurantImage(r, idx);
                  
                  // Mock rating & delivery time for realistic aesthetic
                  const rating = (4.2 + (parseInt(r._id?.slice(-2) || "0", 16) % 8) * 0.1).toFixed(1);
                  const deliveryTime = `${25 + (parseInt(r._id?.slice(-2) || "0", 16) % 20)} min`;

                  return (
                    <div
                      key={r._id}
                      onClick={() => handleRestaurantClick(r)}
                      className="group bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between transform hover:-translate-y-1"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                          <img
                            src={coverImage}
                            alt={r.restaurantName || r.fullName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <FaClock size={10} className="text-amber-400" />
                            {deliveryTime}
                          </div>
                          <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                            <span>{rating}</span>
                            <FaStar size={10} />
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-5 space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                              {r.restaurantName !== "N/A" ? r.restaurantName : r.fullName}
                            </h3>
                          </div>

                          <p className="text-xs text-orange-600 font-bold tracking-wide uppercase">
                            {r.cuisine !== "N/A" ? r.cuisine : "Multi-Cuisine • Fast Food"}
                          </p>

                          <div className="flex items-center text-xs text-slate-500 gap-1 pt-1">
                            <FaMapMarkerAlt className="text-slate-400 shrink-0" />
                            <span className="truncate">
                              {r.address !== "N/A" ? `${r.address}, ${r.city}` : `${r.city || "Local City"}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Action */}
                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                          <span>View Menu & Order</span>
                          <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderNow;