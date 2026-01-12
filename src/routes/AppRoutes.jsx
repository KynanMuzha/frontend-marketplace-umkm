import { Routes, Route, Navigate } from "react-router-dom";

// BUYER
import Home from "../pages/buyer/Home";
import Cart from "../pages/cart/Cart";
import Profile from "../pages/buyer/Profile";

// AUTH
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// ADMIN
import Dashboard from "../pages/admin/Dashboard";

// 🔹 Route Guard Admin
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

// 🔹 Route Guard Buyer (opsional)
const BuyerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* CART */}
      <Route path="/cart" element={<BuyerRoute><Cart /></BuyerRoute>} />

      {/* PROFILE */}
      <Route path="/profile" element={<BuyerRoute><Profile /></BuyerRoute>} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <Dashboard />
        </AdminRoute>
      } />
    </Routes>
  );
}
