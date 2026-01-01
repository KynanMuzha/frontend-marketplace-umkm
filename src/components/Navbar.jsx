import logo from "../assets/logo.jpeg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUser(null);
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.avatar && !parsedUser.avatar.startsWith("http")) {
      parsedUser.avatar = `http://localhost:8000/storage/avatars/${parsedUser.avatar}`;
    }

    setUser(parsedUser);
  };

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

  const handleCartClick = () => {
    if (!user) {
      navigate("/login"); // ⬅️ ini kuncinya
    } else {
      navigate("/cart");
    }
  };

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
            <span>{0}</span>
          </div>
        )}

        <div className="auth">
          {!user ? (
            <>
              <Link to="/login" className="btn-login">Masuk</Link>
              <Link to="/register" className="btn-register">Daftar</Link>
            </>
          ) : (
            <div className="profile-wrapper">
              <div
                className="profile-circle"
                onClick={() => navigate("/profile")}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="profile-avatar-circle" />
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
