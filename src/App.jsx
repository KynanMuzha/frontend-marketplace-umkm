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


/* SELLER */
import HomeSeller from "./pages/seller/HomeSeller";
import CreateProduct from "./pages/seller/CreateProduct";
import EditProduct from "./pages/seller/EditProduct";
import Orders from "./pages/seller/orders/Orders";
import OrderDetail from "./pages/seller/orders/OrderDetail";

/* PROTECTION */
import ProtectedSellerRoute from "./routes/ProtectedSellerRoute";

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

        {/* SELLER */}
        <Route
          path="/seller"
          element={
            <ProtectedSellerRoute>
              <HomeSeller />
            </ProtectedSellerRoute>
          }
        />

        <Route
          path="/seller/products/create"
          element={
            <ProtectedSellerRoute>
              <CreateProduct />
            </ProtectedSellerRoute>
          }
        />

        <Route
          path="/seller/products/edit/:id"
          element={
            <ProtectedSellerRoute>
              <EditProduct />
            </ProtectedSellerRoute>
          }
        />

        {/* SELLER ORDERS */}
      <Route
        path="/seller/orders"
        element={
          <ProtectedSellerRoute>
            <Orders />
          </ProtectedSellerRoute>
        }
      />

      <Route
        path="/seller/orders/:id"
        element={
          <ProtectedSellerRoute>
            <OrderDetail />
          </ProtectedSellerRoute>
        }
      />
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