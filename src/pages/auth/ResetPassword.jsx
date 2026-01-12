import { useState } from "react";
import axios from "axios";
import "../../styles/auth.css";

export default function ResetPassword() {
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
      await axios.post("http://localhost:8000/api/reset-password", form);

      alert("Password berhasil direset");
      window.location.href = "/login";
    } catch (err) {
      alert("OTP salah atau kadaluarsa");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="subtitle">
          Masukkan OTP dan password baru
        </p>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="otp"
            placeholder="Kode OTP"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password baru"
            onChange={handleChange}
            required
          />

          <input
            name="password_confirmation"
            type="password"
            placeholder="Konfirmasi password"
            onChange={handleChange}
            required
          />

          <button className="btn-primary">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
