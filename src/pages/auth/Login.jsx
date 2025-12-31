import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/api/login",
        form,
        { headers: { Accept: "application/json" } }
      );

      let user = res.data.user;

      // Jika ada avatar, ubah menjadi URL lengkap
      if (user.avatar) {
        user.avatar = user.avatar.startsWith("http")
          ? user.avatar
          : `http://localhost:8000/storage/avatars/${user.avatar}`;
      }

      // Simpan token & user di localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Email atau password salah");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* HEADER */}
        <h2>Masuk</h2>
        <p className="subtitle">
          Masuk untuk mulai berbelanja di PasarDesa
        </p>

        {/* FORM */}
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

          <button type="submit" className="btn-primary">
            Masuk
          </button>

          {/* LUPA PASSWORD */}
          <div className="forgot-password">
            <Link to="/forgot-password">Lupa password?</Link>
          </div>
        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </div>
      </div>
    </div>
  );
}
