import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/footer.css";
import logo from "../assets/logo.png";
import SellerModal from "../components/SellerModal";

export default function Footer() {
  const [showSeller, setShowSeller] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-container">

          {/* BRAND */}
          <div className="footer-section brand">
            <div className="footer-logo">
              <img src={logo} alt="PasarDesa" />
              <span>PasarDesa</span>
            </div>
            <p>
              Marketplace UMKM PasarDesa untuk mendukung ekonomi lokal
              dan memudahkan transaksi secara digital.
            </p>
          </div>

          {/* MENU */}
          <div className="footer-section">
            <h4>Layanan</h4>
            <ul>
              <li>
                <Link to="/#produk-section" className="footer-link">
                  Belanja Produk
                </Link>
              </li>

              <li
                className="footer-link"
                onClick={() => setShowSeller(true)}
              >
                Jadi Penjual
              </li>

              <li>
                <Link to="/pengiriman" className="footer-link">
                  Pengiriman
                </Link>
              </li>

              <li>
                <Link to="/pembayaran" className="footer-link">
                  Pembayaran
                </Link>
              </li>
            </ul>
          </div>

          {/* BANTUAN */}
          <div className="footer-section">
            <h4>Bantuan</h4>
            <ul>
              <li>
                <Link to="/pusat-bantuan" className="footer-link">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link to="/syarat-dan-ketentuan" className="footer-link">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Kebijakan Privasi
                </Link>
              </li>

            </ul>
          </div>

          {/* KONTAK */}
          <div className="footer-section">
            <h4>Kontak</h4>
            <p>Email: support@pasardesa.id</p>
            <p>WhatsApp: 08123456789</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} PasarDesa. All rights reserved.
        </div>
      </footer>

      {/* 🔥 MODAL DI SINI */}
      {showSeller && (
        <SellerModal onClose={() => setShowSeller(false)} />
      )}
    </>
  );
}
