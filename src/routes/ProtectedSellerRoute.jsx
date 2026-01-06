import { Navigate } from "react-router-dom";

export default function ProtectedSellerRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !["seller", "admin"].includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
