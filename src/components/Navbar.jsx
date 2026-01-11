import logo from "../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../service/api";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    if (user && user.role !== "penjual" && token) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [user, location]);

  const handleSearch = (e) => {
      if (e.key === "Enter" && search.trim() !== "") {
        navigate(`/?search=${search}`);
      }
    };
  
  const handleSearchClick = () => {
    if (search.trim() !== "") {
      navigate(`/?search=${search}`);
    }
  };

  const handleCancelSearch = () => {
    setSearch("");
    navigate("/");
  };

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/cart");
      const totalQty = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">PasarDesa</span>
        </Link>

        <div className="search-box">
          <input
            type="text"
            placeholder="Cari di PasarDesa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />

          {/* ❌ CLEAR (MUNCUL SAAT ADA ISI) */}
          {search && (
            <button
              className="btn-clear-search"
              onClick={handleCancelSearch}
              aria-label="Clear search"
            >
              × 
            </button>
          )}

          {/* 🔍 SEARCH */}
          <button
            className="btn-search-action"
            onClick={() => {
              if (search.trim() !== "") {
                navigate(`/?search=${search}`);
              }
            }}
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {user?.role !== "penjual" && (
          <div className="cart" onClick={() => navigate("/cart")}>
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
            <div className="profile-dropdown">
              <div className="profile-circle">
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

              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>

                <button onClick={() => navigate("/profile")}>
                  Profil Saya
                </button>

                {/* Hanya tampilkan "Pesanan Saya" jika bukan penjual */}
                {user.role !== "penjual" && (
                  <button onClick={() => navigate("/pesanan")}>
                    Pesanan Saya
                  </button>
                )}

                <div className="dropdown-divider"></div>

                <button
                  className="logout-item"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
