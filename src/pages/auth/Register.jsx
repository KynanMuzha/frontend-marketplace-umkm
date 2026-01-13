import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import "../../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Pilih role terlebih dahulu");
      return;
    }

    try {
      await api.post("/register", {
        ...form,
        role,
      });

      alert("Registrasi berhasil");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response || err);
      alert("Register gagal");
    }
    };

    const [showPassword, setShowPassword] = useState(false);

  };

  return (
    <div className={`auth-page ${role ? `role-${role}` : ""}`}>
      <div className="auth-card">
        <h2>Daftar Akun</h2>
        <p className="subtitle">Pilih peran sebelum mendaftar</p>

        <div className="role-select">
  <button
    type="button"
    className={`role ${role === "pembeli" ? "active" : ""}`}
    onClick={() => setRole("pembeli")}
  >
    <span className="role-icon">
      {/* ICON PEMBELI */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 6h15l-1.5 9h-12z" strokeWidth="2"/>
        <circle cx="9" cy="20" r="1.5"/>
        <circle cx="18" cy="20" r="1.5"/>
      </svg>
    </span>
    Pembeli
  </button>

  <button
    type="button"
    className={`role ${role === "penjual" ? "active" : ""}`}
    onClick={() => setRole("penjual")}
  >
    <span className="role-icon">
      {/* ICON PENJUAL */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 9h18l-1.5 11h-15z" strokeWidth="2"/>
        <path d="M7 9V6a5 5 0 0110 0v3" strokeWidth="2"/>
      </svg>
    </span>
    Penjual
  </button>
</div>


        <form onSubmit={handleSubmit}>
          {/* Jika penjual, tampilkan input Nama Toko */}
          {role === "penjual" ? (
            <input
              name="name"
              placeholder="Nama Toko"
              onChange={handleChange}
              required
            />
          ) : (
            <input
              name="name"
              placeholder="Nama lengkap"
              onChange={handleChange}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

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
=======
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary">
            Daftar
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun? <a href="/login">Masuk</a>
        </div>
      </div>
    </div>
  );

