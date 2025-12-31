import { useState } from "react";
import axios from "axios";
import "../../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/forgot-password", {
        email,
      });

      alert("OTP berhasil dikirim ke email");
      window.location.href = "/reset-password";
    } catch (err) {
      alert("Email tidak ditemukan");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Lupa Password</h2>
        <p className="subtitle">
          Masukkan email untuk menerima kode OTP
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email terdaftar"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="btn-primary">Kirim OTP</button>
        </form>
      </div>
    </div>
  );
}
