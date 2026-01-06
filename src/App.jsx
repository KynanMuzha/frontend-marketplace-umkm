import { BrowserRouter, Routes, Route } from "react-router-dom";

/* BUYER */
import Home from "./pages/buyer/Home";
import ProductDetail from "./pages/buyer/ProductDetail";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/buyer/Profile";

/* AUTH */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/* SELLER */
import HomeSeller from "./pages/seller/HomeSeller";
import CreateProduct from "./pages/seller/CreateProduct";
import EditProduct from "./pages/seller/EditProduct";

/* PROTECTION */
import ProtectedSellerRoute from "./routes/ProtectedSellerRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* BUYER */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
