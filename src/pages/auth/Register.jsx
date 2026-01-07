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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Daftar Akun</h2>
        <p className="subtitle">Pilih peran sebelum mendaftar</p>

        <div className="role-select">
          <button
            type="button"
            className={`role ${role === "pembeli" ? "active" : ""}`}
            onClick={() => setRole("pembeli")}
          >
            Pembeli
          </button>
          <button
            type="button"
            className={`role ${role === "penjual" ? "active" : ""}`}
            onClick={() => setRole("penjual")}
          >
            Penjual
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nama lengkap" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

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
}
