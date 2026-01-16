import logo from "../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../service/api";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  /* =======================
     AMBIL DATA USER
  ======================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  
  /* =======================
     HOME PATH BERDASARKAN ROLE
  ======================== */
    const getHomePath = () => {
      if (user?.role === "penjual") {
        return "/homeseller";
      }
      return "/";
    };

  /* =======================
     CART KHUSUS BUYER
  ======================== */
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
        (sum, item) => sum + Number(item.quantity),
        0
      );

      setCartCount(totalQty);
    } catch (err) {
      setCartCount(0);
    }
  };

  /* =======================
     SEARCH PATH BERDASARKAN ROLE
  ======================== */
  const getSearchPath = () => {
    if (user?.role === "penjual") {
      return "/seller";
      // atau: "/seller/products"
    }
    return "/";
  };

  /* =======================
     HANDLER SEARCH
  ======================== */
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`${getSearchPath()}?search=${search}`);
    }
  };

  const handleSearchClick = () => {
    if (search.trim() !== "") {
      navigate(`${getSearchPath()}?search=${search}`);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    navigate(getSearchPath(), { replace: true });
  };

  /* =======================
     LOGOUT
  ======================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    navigate("/");
  };

  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "";

  /* =======================
     RENDER
  ======================== */
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(getHomePath())}
        >
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">PasarDesa</span>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari di PasarDesa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />

          {search && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

          <button
            className="btn-search-action"
            onClick={handleSearchClick}
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

        {/* CART (BUYER ONLY) */}
        {user?.role !== "penjual" && (
          <div
            className="cart"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>
        )}

        {/* AUTH */}
        <div className="auth">
          {!user ? (
            <>
              <Link to="/login" className="btn-login">
                Masuk
              </Link>
              <Link to="/register" className="btn-register">
                Daftar
              </Link>
            </>
          ) : (
            <div className="profile-dropdown">
              <div
                className="profile-circle"
                onClick={() => setOpen(!open)}
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

              {open && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <button onClick={() => navigate("/profile")}>
                    Profil Saya
                  </button>

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
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
