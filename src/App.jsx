import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* =======================
   COMPONENTS
======================= */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* =======================
   BUYER PAGES
======================= */
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
import TentangKami from "./pages/buyer/TentangKami";

/* =======================
   AUTH PAGES
======================= */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/* =======================
   SELLER PAGES
======================= */
import HomeSeller from "./pages/seller/HomeSeller";
import CreateProduct from "./pages/seller/CreateProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/orders/Orders";
import SellerOrderDetail from "./pages/seller/orders/OrderDetail";

/* =======================
   ADMIN PAGES  ✅ DARI AppRoutes.jsx
======================= */
import Dashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import Reports from "./pages/admin/Reports";
import CategoryList from "./pages/admin/category/CategoryList";
import CategoryForm from "./pages/admin/category/CategoryForm";
import UserList from "./pages/admin/user/UserList";
import UserForm from "./pages/admin/user/UserForm";

/* =======================
   CHECKOUT
======================= */
import Checkout from "./pages/checkout/Checkout";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";

/* =======================
   ROUTE GUARDS
======================= */
const BuyerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  return children;
};

const SellerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "penjual") return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

/* =======================
   404 PAGE
======================= */
const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: 50 }}>
    <h1>404</h1>
    <p>Halaman tidak ditemukan</p>
  </div>
);

/* =======================
   APP WRAPPER
======================= */
function AppWrapper() {
  const location = useLocation();

  const hideLayoutPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/admin",
  ];

  const hideLayout = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
    
        {/* PRODUCT */}
        <Route path="/product/:id" element={<ProductDetail />} />

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
          path="/checkout"
          element={
            <BuyerRoute>
              <Checkout />
            </BuyerRoute>
          }
        />
        <Route
          path="/checkout-success"
          element={
            <BuyerRoute>
              <CheckoutSuccess />
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
        <Route
          path="/pesanan"
          element={
            <BuyerRoute>
              <PesananSaya />
            </BuyerRoute>
          }
        />

        <Route path="/kategori/:id" element={<CategoryPage />} />
        <Route path="/pembayaran" element={<PaymentInfo />} />
        <Route path="/pengiriman" element={<ShippingInfo />} />
        <Route path="/pusat-bantuan" element={<HelpCenter />} />
        <Route path="/syarat-dan-ketentuan" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tentang-kami" element={<TentangKami />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* SELLER */}
        <Route
          path="/seller"
          element={
            <SellerRoute>
              <HomeSeller />
            </SellerRoute>
          }
        />
        <Route
          path="/seller/products/create"
          element={
            <SellerRoute>
              <CreateProduct />
            </SellerRoute>
          }
        />
        <Route
          path="/seller/products/edit/:id"
          element={
            <SellerRoute>
              <EditProduct />
            </SellerRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <SellerRoute>
              <SellerOrders />
            </SellerRoute>
          }
        />
        <Route
          path="/seller/orders/:id"
          element={
            <SellerRoute>
              <SellerOrderDetail />
            </SellerRoute>
          }
        />

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        
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
              <AdminOrders />
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

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

/* =======================
   APP ROOT
======================= */
export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
