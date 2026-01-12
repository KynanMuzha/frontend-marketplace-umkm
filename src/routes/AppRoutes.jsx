import { Routes, Route } from "react-router-dom";

// BUYER
import Home from "../pages/buyer/Home";
import Cart from "../pages/cart/Cart";
import Profile from "../pages/buyer/Profile"; // ← import halaman profil

// AUTH
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* CART */}
      <Route path="/cart" element={<Cart />} />

      {/* PROFILE */}
      <Route path="/profile" element={<Profile />} />  {/* ← tambah route ini */}

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
