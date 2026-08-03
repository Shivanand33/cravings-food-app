import React, { useEffect, useState } from "react";
import AddMenuItemModal from "./modals/AddMenuItemModal";
import api from "../../config/Api";
import toast from "react-hot-toast";
import { 
  FaPlus, 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaUtensils, 
  FaClock, 
  FaUserFriends, 
  FaThLarge, 
  FaList,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import ViewItemModal from "./modals/ViewItemModal";
import EditItemModal from "./modals/EditItemModal";

const DEFAULT_MENU_ITEMS = [
  {
    _id: "menu-dummy-1",
    itemName: "Paneer Tikka Butter Masala",
    description: "Cottage cheese cubes marinated in spices, grilled in tandoor and cooked in rich creamy tomato gravy.",
    price: 320,
    type: "veg",
    cuisine: "North Indian",
    preparationTime: "20",
    servingSize: "2",
    availability: "available",
    images: [{ url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=500" }],
    createdAt: new Date().toISOString()
  },
  {
    _id: "menu-dummy-2",
    itemName: "Chicken Tikka Dum Biryani",
    description: "Fragrant basmati rice layered with juicy tandoori chicken tikka pieces, saffron and aromatic spices.",
    price: 390,
    type: "non-veg",
    cuisine: "Hyderabadi",
    preparationTime: "25",
    servingSize: "1",
    availability: "available",
    images: [{ url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=500" }],
    createdAt: new Date().toISOString()
  },
  {
    _id: "menu-dummy-3",
    itemName: "Pepperoni Supreme Pizza (12\")",
    description: "Crispy hand-tossed crust topped with spicy pepperoni slices, mozzarella cheese & Italian herbs.",
    price: 480,
    type: "non-veg",
    cuisine: "Italian",
    preparationTime: "18",
    servingSize: "2",
    availability: "available",
    images: [{ url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500" }],
    createdAt: new Date().toISOString()
  },
  {
    _id: "menu-dummy-4",
    itemName: "Farmhouse Veggie Overload Pizza",
    description: "Loaded with crunchy capsicum, sweet corn, fresh tomatoes, mushrooms, olives and extra cheese.",
    price: 420,
    type: "veg",
    cuisine: "Italian",
    preparationTime: "15",
    servingSize: "2",
    availability: "available",
    images: [{ url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500" }],
    createdAt: new Date().toISOString()
  },
  {
    _id: "menu-dummy-5",
    itemName: "Crispy Chilli Garlic Hakka Noodles",
    description: "Wok-tossed noodles with shredded vegetables, burnt garlic, red chillies and savory soy sauce.",
    price: 240,
    type: "veg",
    cuisine: "Chinese",
    preparationTime: "12",
    servingSize: "1",
    availability: "available",
    images: [{ url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500" }],
    createdAt: new Date().toISOString()
  },
  {
    _id: "menu-dummy-6",
    itemName: "Molten Choco Lava Cake",
    description: "Warm chocolate cake with a rich oozing chocolate fudge center, served fresh from the oven.",
    price: 160,
    type: "veg",
    cuisine: "Dessert",
    preparationTime: "10",
    servingSize: "1",
    availability: "available",
    images: [{ url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=500" }],
    createdAt: new Date().toISOString()
  }
];

const RestaurantMenu = () => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isViewItemModalOpen, setIsViewItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'veg', 'non-veg'

  const fetchMenuItem = async () => {
    try {
      const res = await api.get("/restaurant/menuItems");
      const fetched = res.data.data || [];
      if (fetched.length > 0) {
        setMenuItems(fetched);
      } else {
        setMenuItems(DEFAULT_MENU_ITEMS);
      }
    } catch (error) {
      console.log(error);
      setMenuItems(DEFAULT_MENU_ITEMS);
    }
  };

  useEffect(() => {
    if (!isAddItemModalOpen && !isEditItemModalOpen) fetchMenuItem();
  }, [isAddItemModalOpen, isEditItemModalOpen]);

  const toggleAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item._id === itemId) {
          const newStatus = item.availability === "available" ? "unavailable" : "available";
          toast.success(`${item.itemName} marked as ${newStatus.toUpperCase()}`);
          return { ...item, availability: newStatus };
        }
        return item;
      })
    );
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-sans p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* 🔴 Top Section Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-orange-500/20">
        <div className="space-y-1">
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
            🍽️ Menu & Dishes Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Food Menu Management</h1>
          <p className="text-xs text-slate-300">
            Create, edit and manage availability of your restaurant's delicious dishes.
          </p>
        </div>

        <button
          onClick={() => setIsAddItemModalOpen(true)}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-600/30 transition active:scale-95 flex items-center gap-2"
        >
          <FaPlus /> Add New Dish
        </button>
      </div>

      {/* 🟡 Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search dish name or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Veg/Non-Veg Filter Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-bold">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${typeFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              All ({menuItems.length})
            </button>
            <button
              onClick={() => setTypeFilter("veg")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${typeFilter === "veg" ? "bg-green-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              <span className="w-2 h-2 rounded-full bg-green-300" /> Veg
            </button>
            <button
              onClick={() => setTypeFilter("non-veg")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${typeFilter === "non-veg" ? "bg-red-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              <span className="w-2 h-2 rounded-full bg-red-300" /> Non-Veg
            </button>
          </div>

          {/* Cards vs Table View Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition ${viewMode === "cards" ? "bg-orange-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
              title="Cards View"
            >
              <FaThLarge size={14} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition ${viewMode === "table" ? "bg-orange-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
              title="Table View"
            >
              <FaList size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* 🟢 Dishes Display Container */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
          <div className="text-5xl">🍕</div>
          <h3 className="text-lg font-bold text-slate-800">No menu dishes found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or add a new menu dish.</p>
        </div>
      ) : viewMode === "cards" ? (
        
        /* CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isAvailable = item.availability === "available";
            const isVeg = item.type?.toLowerCase() === "veg";
            const imageUrl = item.images?.[0]?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500";

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-lg transition duration-200 flex flex-col justify-between group"
              >
                {/* Dish Image Banner */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={imageUrl}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  
                  {/* Veg / Non-Veg Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 text-[10px] font-extrabold border border-slate-100">
                    <span className={`w-2.5 h-2.5 rounded-full border border-white ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
                    <span className={isVeg ? "text-green-700" : "text-red-700"}>
                      {isVeg ? "VEG" : "NON-VEG"}
                    </span>
                  </div>

                  {/* Cuisine Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                    {item.cuisine}
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-extrabold text-base text-slate-900 leading-snug">{item.itemName}</h3>
                      <span className="font-black text-orange-600 text-lg shrink-0">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Prep time & serving */}
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 border-t border-slate-100 pt-2">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-orange-500" /> {item.preparationTime || "15"} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUserFriends className="text-orange-500" /> Serves {item.servingSize || "1"}
                    </span>
                  </div>

                  {/* Footer Actions & Availability Switch */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleAvailability(item._id)}
                      className={`flex items-center gap-1.5 text-xs font-black uppercase transition ${
                        isAvailable ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {isAvailable ? <FaToggleOn size={22} className="text-emerald-500" /> : <FaToggleOff size={22} className="text-slate-400" />}
                      <span>{isAvailable ? "In Stock" : "Out of Stock"}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedItem(item); setIsViewItemModalOpen(true); }}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                        title="View Details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => { setSelectedItem(item); setIsEditItemModalOpen(true); }}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                        title="Edit Dish"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Cuisine</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {filteredItems.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"}
                        alt={item.itemName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900">{item.itemName}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{item.description}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-bold">{item.cuisine}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.type?.toLowerCase() === "veg" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900 text-sm">₹{item.price}</td>
                    <td className="p-4">
                      <button onClick={() => toggleAvailability(item._id)}>
                        {item.availability === "available" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <FaCheckCircle /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                            <FaTimesCircle /> Unavailable
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setSelectedItem(item); setIsViewItemModalOpen(true); }}
                          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => { setSelectedItem(item); setIsEditItemModalOpen(true); }}
                          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <FaEdit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* Modals */}
      {isAddItemModalOpen && (
        <AddMenuItemModal onClose={() => setIsAddItemModalOpen(false)} />
      )}
      {isViewItemModalOpen && selectedItem && (
        <ViewItemModal
          onClose={() => setIsViewItemModalOpen(false)}
          selectedItem={selectedItem}
        />
      )}
      {isEditItemModalOpen && selectedItem && (
        <EditItemModal
          onClose={() => setIsEditItemModalOpen(false)}
          selectedItem={selectedItem}
        />
      )}

    </div>
  );
};

export default RestaurantMenu;