import { Navigate } from "react-router-dom";

export default function ProtectedSellerRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ⏳ Tunggu sampai user benar-benar ada
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Bukan penjual
  if (user.role !== "penjual") {
    return <Navigate to="/" replace />;
  }

  // ✅ Penjual
  return children;
}