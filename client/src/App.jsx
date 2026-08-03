import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/dashboards/UserDashboard";
import RiderDashboard from "./pages/dashboards/RiderDashboard";
import ResturantDashboard from "./pages/dashboards/ResturantDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import OrderNow from "./pages/OrderNow";
import RestaurantDisplayMenu from "./pages/RestaurantDisplayMenu";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Header />

        <div className="pt-16 min-h-[calc(100vh-64px)] flex flex-col justify-between">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/rider-dashboard" element={<RiderDashboard />} />
              <Route path="/resturant-dashboard" element={<ResturantDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/order-now" element={<OrderNow />} />
              <Route path="/menu" element={<OrderNow />} />
              <Route path="/restaurantMenu" element={<RestaurantDisplayMenu />} />
              <Route path="/checkoutPage" element={<CheckoutPage />} />
              <Route path="/checkout-page" element={<CheckoutPage />} />
              <Route path="/cart" element={<CheckoutPage />} />
              <Route path="/paymentSuccess" element={<PaymentSuccessPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;