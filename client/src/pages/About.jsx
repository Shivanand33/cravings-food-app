import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUtensils, 
  FaShippingFast, 
  FaUsers, 
  FaHeart, 
  FaAward, 
  FaClock, 
  FaShieldAlt, 
  FaMapMarkerAlt 
} from "react-icons/fa";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-slate-800 bg-slate-50/60 pb-16">
      
      {/* 1. Hero Banner */}
      <div className="relative w-full h-[55vh] min-h-[380px] flex items-center justify-center text-center text-white bg-slate-950 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Creavings Food Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
        
        <div className="relative z-10 px-4 max-w-3xl space-y-4">
          <span className="inline-block bg-orange-500/20 text-orange-400 border border-orange-500/30 backdrop-blur-md text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
            🚴 Faster Than Your Hunger
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            More Than Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Food Delivery</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Creavings connects foodies with the best local restaurants and passionate chefs, bringing warm, delicious meals directly to your doorstep.
          </p>
        </div>
      </div>

      {/* 2. Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Image visual */}
          <div className="lg:w-1/2 relative w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Creavings Delivery Rider" 
                className="w-full h-[380px] sm:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <p className="font-extrabold text-base">Superfast Delivery Network</p>
                <p className="text-xs text-slate-200">Active riders operating 24/7 across the city.</p>
              </div>
            </div>
            {/* Background Blob Accents */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-orange-200/50 rounded-full blur-2xl -z-10 pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-amber-200/50 rounded-full blur-2xl -z-10 pointer-events-none" />
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 space-y-6">
            <span className="text-orange-600 font-extrabold uppercase tracking-wider text-xs bg-orange-100 px-3 py-1 rounded-full">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Delivering Happiness, <br /> One Bite at a Time.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              Founded with a passion for good taste, <strong>Creavings</strong> was created to solve a simple challenge: ensuring food lovers never have to compromise on quality, freshness, or delivery speed.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              We partner directly with top-tier dining establishments, cloud kitchens, and local gems to craft an effortless food ordering experience.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl text-lg"><FaAward /></div>
                <div>
                  <p className="font-extrabold text-xs text-slate-900">Curated Quality</p>
                  <p className="text-[10px] text-slate-400">Verified top restaurants</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl text-lg"><FaClock /></div>
                <div>
                  <p className="font-extrabold text-xs text-slate-900">30 Min Delivery</p>
                  <p className="text-[10px] text-slate-400">Fast & fresh piping hot</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Stats Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 py-16 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <FaUsers className="text-3xl mx-auto opacity-80" />
            <h3 className="text-3xl sm:text-4xl font-black">50,000+</h3>
            <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">Happy Foodies</p>
          </div>
          <div className="space-y-1">
            <FaUtensils className="text-3xl mx-auto opacity-80" />
            <h3 className="text-3xl sm:text-4xl font-black">500+</h3>
            <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">Partner Restaurants</p>
          </div>
          <div className="space-y-1">
            <FaShippingFast className="text-3xl mx-auto opacity-80" />
            <h3 className="text-3xl sm:text-4xl font-black">1 Million+</h3>
            <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">Deliveries Done</p>
          </div>
          <div className="space-y-1">
            <FaHeart className="text-3xl mx-auto opacity-80" />
            <h3 className="text-3xl sm:text-4xl font-black">4.8 / 5</h3>
            <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">Average Rating</p>
          </div>
        </div>
      </div>

      {/* 4. Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Why Foodies Choose Creavings?</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">We deliver an uncompromised food experience built around speed, hygiene, and choice.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Lightning Fast Delivery", desc: "Our fleet of dedicated riders ensures your meal arrives fresh and hot within minutes.", icon: "⚡" },
            { title: "Hygiene & Quality Standard", desc: "Every partner kitchen is audited for strict food safety and hygiene protocols.", icon: "🛡️" },
            { title: "Live Order Tracking", desc: "Track your food order status step-by-step from kitchen preparation to your door.", icon: "📍" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 text-center space-y-3">
              <div className="text-5xl">{item.icon}</div>
              <h3 className="text-xl font-extrabold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Got a Craving? Let's Fix That.</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
              Explore hundreds of restaurants and order your favorite dish online now.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/order-now')}
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm rounded-full shadow-lg shadow-orange-500/30 transition transform hover:scale-105"
              >
                Order Now 🍽️
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-full border border-white/20 transition"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;