import logo from "../assets/logo.jpeg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // untuk mendeteksi pergantian halaman

  // Ambil user dari localStorage
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);

    // Pastikan avatar pakai URL penuh
    if (parsedUser.avatar && !parsedUser.avatar.startsWith("http")) {
      parsedUser.avatar = `http://localhost:8000/storage/avatars/${parsedUser.avatar}`;
    }

    setUser(parsedUser);
  };

  // Load user setiap mount dan setiap pergantian halaman
  useEffect(() => {
    loadUser();
  }, [location]);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">PasarDesa</span>
        </Link>

        {/* SEARCH */}
        <div className="search-box">
          <input type="text" placeholder="Cari di PasarDesa" />
        </div>

        {/* CART hanya untuk guest dan pembeli */}
        {user?.role !== "penjual" && (
          <div className="cart" onClick={() => navigate("/cart")}>
            🛒
            <span>{0}</span>
          </div>
        )}

        {/* AUTH / PROFILE */}
        <div className="auth">
          {!user ? (
            <>
              <Link to="/login" className="btn-login">Masuk</Link>
              <Link to="/register" className="btn-register">Daftar</Link>
            </>
          ) : (
            <div className="profile-wrapper">
              {/* Circle profil bisa klik → buka Profil */}
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

              {/* Badge hanya untuk Penjual */}
              {user.role === "penjual" && (
                <span className="role-badge">Penjual</span>
              )}

              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
