// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// =======================
// BUYER PAGES
// =======================
import Home from "../pages/buyer/Home";
import Cart from "../pages/cart/Cart";
import Profile from "../pages/buyer/Profile";

// =======================
// AUTH PAGES
// =======================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// =======================
// ADMIN PAGES
// =======================
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import Reports from "../pages/admin/Reports";
import CategoryList from "../pages/admin/category/CategoryList";
import CategoryForm from "../pages/admin/category/CategoryForm";

// USER
import UserList from "../pages/admin/user/UserList";
import UserForm from "../pages/admin/user/UserForm";

// =======================
// ROUTE GUARD ADMIN
// =======================
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

// =======================
// ROUTE GUARD BUYER
// =======================
const BuyerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  return children;
};

// =======================
// 404 PAGE
// =======================
const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>404</h1>
    <p>Halaman tidak ditemukan</p>
  </div>
);

// =======================
// APP ROUTES
// =======================
export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* BUYER */}
      <Route
        path="/cart"
        element={
          <BuyerRoute>
            <Cart />
          </BuyerRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <BuyerRoute>
            <Profile />
          </BuyerRoute>
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <Orders />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <Reports />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <CategoryList />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories/new"
        element={
          <AdminRoute>
            <CategoryForm />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories/edit/:id"
        element={
          <AdminRoute>
            <CategoryForm />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserList />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users/edit/:id"
        element={
          <AdminRoute>
            <UserForm />
          </AdminRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
