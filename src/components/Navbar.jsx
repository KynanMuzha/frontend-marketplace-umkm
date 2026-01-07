import logo from "../assets/logo.jpeg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../service/api";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  /* ======================
     LOAD USER
  ====================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  /* ======================
     LOAD CART COUNT
  ====================== */
  useEffect(() => {
    if (user && user.role !== "penjual" && token) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [user, location]);

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/cart");

      const totalQty = res.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  /* ======================
     HELPERS
  ====================== */
  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "";

  /* ======================
     ACTIONS
  ====================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    navigate("/");
  };

  const handleCartClick = () => {
    if (!user) navigate("/login");
    else navigate("/cart");
  };

  /* ======================
     RENDER
  ====================== */
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">PasarDesa</span>
        </Link>

        <div className="search-box">
          <input type="text" placeholder="Cari di PasarDesa" />
        </div>

        {user?.role !== "penjual" && (
          <div className="cart" onClick={handleCartClick}>
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>
        )}

        <div className="auth">
          {!user ? (
            <>
              <Link to="/login" className="btn-login">Masuk</Link>
              <Link to="/register" className="btn-register">Daftar</Link>
            </>
          ) : (
            <div className="navbar-profile">
              <div
                className="profile-circle"
                onClick={() => navigate("/profile")}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="profile-avatar-circle"
                  />
                ) : (
                  getInitial(user.name)
                )}
              </div>

              {user.role === "penjual" && (
                <span className="role-badge">Penjual</span>
              )}

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
