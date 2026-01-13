import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

const API_URL = "http://localhost:8000";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ LOGIN → DAPAT TOKEN
      const loginRes = await axios.post(
        `${API_URL}/api/login`,
        form,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const token = loginRes.data.token;
      localStorage.setItem("token", token);

      // 2️⃣ AMBIL PROFILE TERBARU
      const profileRes = await axios.get(
        `${API_URL}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      let user = profileRes.data;
      localStorage.setItem("role", user.role);

      // 3️⃣ NORMALISASI AVATAR (PASTI URL VALID)
      if (user.avatar && !user.avatar.startsWith("http")) {
        user.avatar = `${API_URL}/storage/${user.avatar}`;
      }

      // 4️⃣ SIMPAN USER FINAL
      localStorage.setItem("user", JSON.stringify(user));

      // 5️⃣ REDIRECT KE HOME
      if (user.role === "penjual") {
        navigate("/seller");
      } else {
        navigate("/");
      }
      // 5️⃣ REDIRECT BERDASARKAN ROLE
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); // user biasa
      }

    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Email atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };
  

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Masuk</h2>
        <p className="subtitle">
          Masuk untuk mulai berbelanja di PasarDesa
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
<div className="password-field">
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    onChange={handleChange}
    required
  />

  <button
    type="button"
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
    aria-label="Toggle password visibility"
  >
    {showPassword ? (
      /* eye-off */
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 3l18 18" strokeWidth="2"/>
        <path d="M10.6 10.6a2 2 0 002.8 2.8" strokeWidth="2"/>
        <path d="M1 12s4-7 11-7a10.94 10.94 0 014.3.88" strokeWidth="2"/>
        <path d="M23 12s-4 7-11 7a10.94 10.94 0 01-4.3-.88" strokeWidth="2"/>
      </svg>
    ) : (
      /* eye */
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      </svg>
    )}
  </button>
</div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}</button>
          </button>

          <div className="forgot-password">
            <Link to="/forgot-password">Lupa password?</Link>
          </div>
        </form>

        <div className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </div>
      </div>
    </div>

  );
}
