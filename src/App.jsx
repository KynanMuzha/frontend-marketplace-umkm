// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// COMPONENT
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// BUYER
import Home from "./pages/buyer/Home";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/buyer/Profile";
import ProductDetail from "./pages/buyer/ProductDetail";

// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function AppWrapper() {
  const location = useLocation();
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <>
      {/* Navbar hanya tampil kalau bukan halaman auth */}
      {!isAuthPage && <Navbar />}

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* PRODUCT */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* BUYER */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      {/* Footer hanya tampil kalau bukan halaman auth */}
      {!isAuthPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
