import "../styles/footer.css";
import logo from "../assets/logo.jpeg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-section brand">
          <div className="footer-logo">
            <img src={logo} alt="PasarDesa" />
            <span>PasarDesa</span>
          </div>
          <p>
            Marketplace produk UMKM desa untuk mendukung ekonomi lokal
            dan memudahkan transaksi secara digital.
          </p>
        </div>

        {/* MENU */}
        <div className="footer-section">
          <h4>Layanan</h4>
          <ul>
            <li>Belanja Produk</li>
            <li>Jadi Penjual</li>
            <li>Pengiriman</li>
            <li>Pembayaran</li>
          </ul>
        </div>

        {/* BANTUAN */}
        <div className="footer-section">
          <h4>Bantuan</h4>
          <ul>
            <li>Pusat Bantuan</li>
            <li>Syarat & Ketentuan</li>
            <li>Kebijakan Privasi</li>
          </ul>
        </div>

        {/* KONTAK */}
        <div className="footer-section">
          <h4>Kontak</h4>
          <p>Email: support@pasardesa.id</p>
          <p>WhatsApp: 08xxxxxxxxxx</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} PasarDesa. All rights reserved.
      </div>
    </footer>
  );
}
