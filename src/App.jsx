// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// COMPONENT
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// BUYER
import Home from "./pages/buyer/Home";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/buyer/Profile";
import PesananSaya from "./pages/buyer/PesananSaya";
import CategoryPage from "./pages/buyer/CategoryPage";
import ProductDetail from "./pages/buyer/ProductDetail";
import PaymentInfo from "./pages/buyer/PaymentInfo";
import ShippingInfo from "./pages/buyer/ShippingInfo";
import HelpCenter from "./pages/buyer/HelpCenter";
import Terms from "./pages/buyer/Terms";
import Privacy from "./pages/buyer/Privacy";

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
// CHECKOUT
import Checkout from "./pages/checkout/Checkout";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";


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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/kategori/:slug" element={<CategoryPage />} />
        <Route path="/pembayaran" element={<PaymentInfo />} />
        <Route path="/pengiriman" element={<ShippingInfo />} />
        <Route path="/pusat-bantuan" element={<HelpCenter />} />
        <Route path="/syarat-dan-ketentuan" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* PESANAN */}
        <Route path="/pesanan" element={<PesananSaya />} />


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