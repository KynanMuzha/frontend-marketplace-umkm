import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/product/ProductDetail";
import Login from "../pages/auth/Login";
import Cart from "../pages/cart/Cart";
// import halaman lain sesuai kebutuhan

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      {/* tambahkan route lain di sini */}
    </Routes>
  );
}
