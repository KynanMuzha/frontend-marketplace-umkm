import { useEffect, useState } from "react";
import api from "../service/api";
import "../styles/seller-modal.css";
import logo from "../assets/logo.png";

export default function SellerModal({ onClose }) {
  const [success, setSuccess] = useState(false);

  const [step, setStep] = useState("register"); // register | otp
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(300);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  /* ================= TIMER OTP ================= */
  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  /* ================= REGISTER ================= */
  const handleRegister = (e) => {
    e.preventDefault();

    api
      .post("/seller/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      .then(() => {
        setStep("otp");
        setTimer(300);
      })
      .catch((err) => {
        console.error(err.response?.data);
        alert(err.response?.data?.message || "Gagal mendaftar sebagai penjual");
      });
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    api
      .post("/seller/verify-otp", {
        email: form.email,
        otp: form.otp,
      })
      .then(() => {
        setSuccess(true);
      })
      .catch(() => alert("Kode OTP salah atau sudah kedaluwarsa"));
  };

  return (
    <>
      {/* ================= MODAL UTAMA ================= */}
      {!success && (
        <div className="seller-modal-overlay">
          <div className="seller-modal">
            {/* CLOSE */}
            <button className="seller-close" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* HEADER */}
            <div className="seller-header">
              <img src={logo} alt="PasarDesa" />
              <h2>Jadi Penjual di PasarDesa</h2>
              <p>
                Kembangkan usaha UMKM Anda dan jangkau lebih banyak pembeli secara
                digital
              </p>
            </div>

            {/* CONTENT */}
            <div className="seller-content">
              <div className="seller-info">
                <h4>Keuntungan Menjadi Penjual</h4>
                <ul>
                  <li>Menjangkau pembeli lebih luas</li>
                  <li>Tanpa biaya pendaftaran</li>
                  <li>Dashboard penjual profesional</li>
                  <li>Mendukung UMKM lokal desa</li>
                </ul>

                <h4>Tata Cara Menjadi Penjual</h4>
                <ol>
                  <li>Daftar sebagai penjual</li>
                  <li>Verifikasi email (OTP)</li>
                  <li>Lengkapi data toko</li>
                  <li>Mulai berjualan</li>
                </ol>
              </div>

              {/* FORM */}
              <form
                className="seller-form"
                onSubmit={step === "register" ? handleRegister : handleVerifyOtp}
              >
                <h4>
                  {step === "register"
                    ? "Registrasi Penjual"
                    : "Verifikasi Kode OTP"}
                </h4>

                {step === "register" && (
                  <>
                    <input
                      type="text"
                      placeholder="Nama Toko"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />

                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />

                    {/* PASSWORD */}
                    <div className="password-field">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                      />

                      <span
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                    </div>

                    <button type="submit" className="btn-primary">
                      Daftar Menjadi Penjual
                    </button>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <p className="otp-info">
                      Kode OTP telah dikirim ke <strong>{form.email}</strong>
                    </p>

                    <input
                      type="text"
                      placeholder="Masukkan Kode OTP"
                      value={form.otp}
                      onChange={(e) =>
                        setForm({ ...form, otp: e.target.value })
                      }
                      required
                    />

                    <p className="otp-timer">
                      Sisa waktu: {Math.floor(timer / 60)}:
                      {(timer % 60).toString().padStart(2, "0")}
                    </p>

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={timer === 0}
                    >
                      Verifikasi OTP
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {success && (
        <div className="success-overlay">
          <div className="success-popup">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>

            <p>Selamat, pendaftaran akun penjual anda sudah berhasil</p>

            <button
              className="btn-success"
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {success && (
  <>
    {/* CONFETTI */}
    <div className="confetti-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: [
              "#22c55e",
              "#4ade80",
              "#86efac",
              "#16a34a",
            ][i % 4],
          }}
        />
      ))}
    </div>

    {/* SUCCESS POPUP */}
    <div className="success-overlay">
      <div className="success-popup">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>

        <p>Selamat, pendaftaran akun penjual anda sudah berhasil</p>

        <button
          className="btn-success"
          onClick={() => {
            setSuccess(false);
            onClose();
          }}
        >
          OK
        </button>
      </div>
    </div>
  </>
)}

    </>
  );
}
