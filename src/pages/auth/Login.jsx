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
      if (user.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/");
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
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
