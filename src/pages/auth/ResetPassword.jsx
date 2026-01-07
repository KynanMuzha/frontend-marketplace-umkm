import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import "../../styles/auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      alert("Password tidak sama");
      return;
    }

    try {
      await api.post("/reset-password", form);
      alert("Password berhasil direset");
      navigate("/login");
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "OTP salah atau kadaluarsa"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="subtitle">Masukkan OTP dan password baru</p>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="otp"
            placeholder="Kode OTP"
            value={form.otp}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password baru"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="password_confirmation"
            type="password"
            placeholder="Konfirmasi password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
          />

          <button className="btn-primary">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
