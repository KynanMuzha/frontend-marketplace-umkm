import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../service/api";
import "../../styles/auth.css";

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
      // 1️⃣ LOGIN → TOKEN
      const loginRes = await api.post("/login", form);
      const token = loginRes.data.token;
      localStorage.setItem("token", token);

      // 2️⃣ AMBIL PROFILE
      const profileRes = await api.get("/profile");
      const user = profileRes.data;

      // 3️⃣ SIMPAN ROLE & USER
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // 4️⃣ REDIRECT BERDASARKAN ROLE
      if (user.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response || err);
      alert(err?.response?.data?.message || "Email atau password salah");
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

          <button type="submit" className="btn-primary" disabled={loading}>
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
