import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { 
  FaMotorcycle, 
  FaSearch, 
  FaStar, 
  FaClock, 
  FaShippingFast, 
  FaFire, 
  FaUtensils, 
  FaShieldAlt, 
  FaHeadset, 
  FaArrowRight,
  FaHeart,
  FaPlus
} from "react-icons/fa";

const FOOD_TEXTS = [
  { text: "Hot & Crispy Pizzas 🍕", highlight: "Pizzas" },
  { text: "Spicy Dum Biryani 🍲", highlight: "Biryani" },
  { text: "Juicy Loaded Burgers 🍔", highlight: "Burgers" },
  { text: "Creamy Alfredo Pasta 🍝", highlight: "Pasta" },
  { text: "Authentic Tandoori Dishes 🥘", highlight: "Tandoori" },
  { text: "Chilled Shakes & Desserts 🍰", highlight: "Desserts" }
];

const CUISINE_TAGS = [
  { label: "Biryani 🍲", search: "Biryani" },
  { label: "Pizza 🍕", search: "Pizza" },
  { label: "Burger 🍔", search: "Burger" },
  { label: "Chinese 🍜", search: "Chinese" },
  { label: "Desserts 🍰", search: "Dessert" },
  { label: "Thali 🍱", search: "Thali" }
];

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  const [textIndex, setTextIndex] = useState(0);
  const [heroSearch, setHeroSearch] = useState("");

  // Rotate food headline text every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % FOOD_TEXTS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/order-now?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/order-now");
    }
  };

  const handleTagClick = (searchTerm) => {
    navigate(`/order-now?search=${encodeURIComponent(searchTerm)}`);
  };

  const featuredRestaurants = [
    {
      id: 1,
      name: "Spice Kingdom",
      cuisine: "Indian • Curry • Biryani",
      rating: 4.9,
      deliveryTime: "25-35 min",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800&auto=format&fit=crop&q=80",
      tag: "Top Rated",
    },
    {
      id: 2,
      name: "Pizza Paradise",
      cuisine: "Italian • Woodfire • Pasta",
      rating: 4.8,
      deliveryTime: "20-30 min",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
      tag: "50% OFF",
    },
    {
      id: 3,
      name: "Dragon Wok",
      cuisine: "Chinese • Pan Asian • Noodles",
      rating: 4.7,
      deliveryTime: "30-40 min",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
      tag: "Popular",
    },
    {
      id: 4,
      name: "Burger Haven",
      cuisine: "American • Fast Food • Shakes",
      rating: 4.6,
      deliveryTime: "15-25 min",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
      tag: "Express",
    },
  ];

  const popularDishes = [
    {
      id: "dish-1",
      itemName: "Special Hyderabadi Biryani",
      restaurant: "Spice Kingdom",
      price: 299,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "dish-2",
      itemName: "Overloaded Cheesy Margherita",
      restaurant: "Pizza Paradise",
      price: 349,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1595854341625-f33ee1043138?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "dish-3",
      itemName: "Schezwan Hakka Noodles",
      restaurant: "Dragon Wok",
      price: 249,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "dish-4",
      itemName: "Double Cheese Crunchy Burger",
      restaurant: "Burger Haven",
      price: 199,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "dish-5",
      itemName: "Royal Tandoori Chicken Platter",
      restaurant: "Spice Kingdom",
      price: 479,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "dish-6",
      itemName: "Stuffed Garlic Breadsticks",
      restaurant: "Pizza Paradise",
      price: 139,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1619531040576-f3045b8274d5?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const handleAddDish = (dish) => {
    addToCart(dish, {
      restaurantName: dish.restaurant,
      fullName: dish.restaurant,
    });
    toast.success(`${dish.itemName} added to cart! 🍽️`);
  };

  return (
    <div className={`font-sans overflow-x-hidden transition-colors duration-500 ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. HERO SECTION WITH FULL BACKGROUND & ANIMATIONS */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        
        {/* Full Screen HD Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />

        {/* Ambient Dark Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Main Hero Content Box */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Texts & Interactive Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 backdrop-blur-md shadow-lg">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                <span className="text-orange-400 font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <FaMotorcycle className="text-sm text-orange-400 animate-bounce" /> Lightning Fast Food Delivery
                </span>
              </div>

              {/* Main Headline with Dynamic Text Rotator */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                  Craving For <br />
                  <span 
                    key={textIndex}
                    className="inline-block text-amber-400 drop-shadow-[0_4px_20px_rgba(251,191,36,0.5)] animate-text-fade-up"
                  >
                    {FOOD_TEXTS[textIndex].text}
                  </span>
                </h1>
                <p className="text-base sm:text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
                  Discover top-rated restaurants, sizzling street treats, and fine dining delivered hot to your doorstep in 30 minutes.
                </p>
              </div>

              {/* Hero Search Box */}
              <form 
                onSubmit={handleHeroSearchSubmit}
                className="relative max-w-2xl bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2 transition-all focus-within:border-orange-500/8 sm:p-2.5"
              >
                <div className="pl-4 text-orange-400 text-xl">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search dishes, restaurants or cuisines..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none px-2 font-medium"
                />
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-600/40 transition-all transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
                >
                  <span>Search Food</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </form>

              {/* Quick Cuisine Tags */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FaFire className="text-orange-500" /> Popular Cravings:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {CUISINE_TAGS.map((tag) => (
                    <button
                      key={tag.label}
                      onClick={() => handleTagClick(tag.search)}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-orange-500/20 text-slate-200 hover:text-orange-400 border border-white/10 hover:border-orange-500/40 text-xs font-bold backdrop-blur-sm transition duration-200 transform hover:-translate-y-0.5"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex items-center gap-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
                    <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" />
                    <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-extrabold text-sm">50,000+</p>
                    <p className="text-slate-400 text-xs font-medium">Happy Foodies</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-extrabold text-sm">
                    <FaStar />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-extrabold text-sm">4.9 / 5.0</p>
                    <p className="text-slate-400 text-xs font-medium">100k+ Reviews</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual & Floating Cards (5 Cols) */}
            <div className="lg:col-span-5 relative hidden lg:block">
              
              {/* Central Food Showcase Image */}
              <div className="relative mx-auto w-80 h-[430px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80"
                  alt="Delicious Hot Pizza"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="px-2.5 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
                    🔥 Trending Dish
                  </span>
                  <h3 className="text-white font-extrabold text-xl mt-1">Gourmet Pepperoni Feast</h3>
                  <p className="text-amber-300 font-bold text-sm">₹349 • 20 Mins</p>
                </div>
              </div>

              {/* Floating Card 1: Express Delivery */}
              <div className="absolute top-6 -left-8 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 animate-float-badge">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 font-bold uppercase">Super Express</p>
                  <p className="text-white font-black text-sm">30 Min Delivery</p>
                </div>
              </div>

              {/* Floating Card 2: Hot Deal Badge */}
              <div className="absolute bottom-10 -right-6 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 animate-float-badge [animation-delay:2s]">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div className="text-left">
                  <p className="text-xs text-emerald-400 font-extrabold uppercase">Special Discount</p>
                  <p className="text-white font-black text-sm">50% OFF First Order</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 2. ANIMATED BIKE DELIVERY RIDER TRACK ACROSS BOTTOM */}
        <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden pointer-events-none z-30">
          
          {/* Animated Glowing Road Line */}
          <div className="absolute bottom-3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          <div className="absolute bottom-3 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 animate-pulse" />

          {/* Bike Rider Container moving horizontally */}
          <div className="absolute bottom-2 left-0 animate-bike-ride flex items-center gap-3">
            
            {/* Rider Floating Order Notification */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-3 py-1.5 rounded-xl shadow-xl border border-white/20 flex items-center gap-2 whitespace-nowrap text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Delivering Hot Order! ⚡</span>
            </div>

            {/* Rider Vector Graphics */}
            <div className="relative flex items-center text-orange-500">
              
              {/* Smoke / Speed particles trail */}
              <div className="absolute -left-6 bottom-1 flex gap-1 animate-smoke-trail">
                <span className="w-2 h-2 rounded-full bg-orange-400/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300/40" />
              </div>

              {/* Rider Icon */}
              <div className="text-4xl text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] transform -scale-x-100">
                <FaMotorcycle />
              </div>

              {/* Spinning Wheels effect */}
              <div className="absolute left-1 bottom-1 w-3 h-3 border-2 border-dashed border-amber-300 rounded-full animate-wheel-spin" />
              <div className="absolute right-1 bottom-1 w-3.5 h-3.5 border-2 border-dashed border-amber-300 rounded-full animate-wheel-spin" />
            </div>

          </div>
        </div>

      </section>

      {/* 2. FEATURED RESTAURANTS SECTION */}
      <section className={`py-24 transition-colors duration-500 relative ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-orange-400 font-extrabold uppercase text-xs tracking-widest flex items-center gap-2">
                <FaUtensils className="text-sm" /> Verified Kitchens
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
                Featured Restaurants 👑
              </h2>
            </div>
            <button 
              onClick={() => navigate("/order-now")}
              className="text-orange-400 font-extrabold hover:text-orange-300 text-sm flex items-center gap-2 group transition"
            >
              <span>Explore All Restaurants</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => navigate("/order-now")}
                className="group bg-slate-950/80 rounded-3xl overflow-hidden border border-slate-800 hover:border-orange-500/50 shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:-translate-y-1.5"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Tag */}
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg">
                    {restaurant.tag}
                  </span>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-amber-400 font-black text-xs border border-white/10 flex items-center gap-1">
                    <FaStar /> {restaurant.rating}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-slate-400 text-xs font-medium mt-1">
                      {restaurant.cuisine}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-4 mt-2">
                    <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <FaClock className="text-orange-400" /> {restaurant.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold bg-emerald-400/10 px-2.5 py-1 rounded-lg">
                      <FaShippingFast /> Free Delivery
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. POPULAR DISHES MENU */}
      <section className={`py-24 transition-colors duration-500 relative overflow-hidden ${isDark ? "bg-slate-950" : "bg-slate-100"}`}>

        {/* Background glow circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-orange-400 font-extrabold uppercase text-xs tracking-widest">
              🔥 Most Loved Dishes
            </span>
            <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Top Trending Menu Items 🥘
            </h2>
            <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Handpicked customer favorites prepared by master chefs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className={`rounded-3xl p-5 border shadow-2xl transition duration-300 flex flex-col justify-between group ${
                  isDark ? "bg-slate-900/90 border-slate-800 hover:border-orange-500/40" : "bg-white border-slate-200 hover:border-orange-400 shadow-slate-200"
                }`}
              >
                <div>
                  <div className="h-56 w-full rounded-2xl overflow-hidden mb-5 relative">
                    <img
                      src={dish.image}
                      alt={dish.itemName}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-200 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                      {dish.restaurant}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`text-xl font-black group-hover:text-orange-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                        {dish.itemName}
                      </h3>
                      <span className="text-amber-400 font-black text-xs flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-lg shrink-0">
                        <FaStar /> {dish.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-5 mt-4 border-t ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                  <div>
                    <span className="text-2xl font-black text-orange-500">
                      ₹{dish.price}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddDish(dish)}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl font-black text-xs transition shadow-lg shadow-orange-600/30 active:scale-95 flex items-center gap-1.5"
                  >
                    <FaPlus /> Add to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE CREAVINGS */}
      <section className={`py-24 transition-colors duration-500 relative ${isDark ? "bg-slate-900" : "bg-orange-50/60"}`}>
        <div className="max-w-7xl mx-auto px-4 text-center space-y-16">
          
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-orange-400 font-extrabold uppercase text-xs tracking-widest">
              Unmatched Experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Why Foodies Love Creavings?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/40 text-left space-y-4 transition duration-300 transform hover:-translate-y-2 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-3xl font-black">
                <FaShippingFast />
              </div>
              <h3 className="text-2xl font-black text-white">Super Fast Delivery</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Piping hot food delivered directly to your doorstep in under 30 minutes with live GPS rider tracking.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-8 rounded-3xl text-left space-y-4 shadow-2xl transform scale-105 z-10 border border-orange-400/30">
              <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center text-3xl font-black backdrop-blur-md">
                <FaShieldAlt />
              </div>
              <h3 className="text-2xl font-black text-white">100% Hygiene Audited</h3>
              <p className="text-orange-100 text-sm font-medium leading-relaxed">
                We strictly audit all partner restaurant kitchens to ensure food is cooked in safe, pristine sanitary conditions.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/40 text-left space-y-4 transition duration-300 transform hover:-translate-y-2 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl font-black">
                <FaHeadset />
              </div>
              <h3 className="text-2xl font-black text-white">24/7 Live Support</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Our customer happiness team is available round-the-clock to assist you with active orders and custom requests.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 relative overflow-hidden text-center text-white">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Ready To Satisfy Your Cravings? <br />
            <span className="text-amber-200">Order Hot Food Now!</span>
          </h2>
          <p className="text-base sm:text-lg text-orange-100 font-semibold max-w-2xl mx-auto">
            Join over 50,000 satisfied foodies. Get delicious meals delivered straight from top local kitchens.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/order-now")}
              className="px-10 py-5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
            >
              <span>Explore Full Menu & Order</span>
              <FaArrowRight className="text-orange-400 text-sm" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
