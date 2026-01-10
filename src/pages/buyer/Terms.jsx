import { useNavigate } from "react-router-dom";
import "../../styles/terms.css"; // pastikan path ini sesuai lokasi styles

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      {/* HEADER */}
      <div className="terms-header">
        <button
          className="terms-back-icon"
          onClick={() => navigate("/")}
          aria-label="Kembali"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <h1 className="terms-header-title">Syarat & Ketentuan</h1>
      </div>

      {/* CONTENT */}
      <div className="terms-content">
        <section>
          <h2>1. Ketentuan Umum</h2>
          <p>
            Selamat datang di PasarDesa. Dengan mengakses platform ini, Anda setuju untuk mematuhi syarat dan ketentuan berikut:
          </p>
          <ul>
            <li>Pengguna wajib berusia minimal 17 tahun.</li>
            <li>Semua transaksi harus dilakukan melalui platform resmi.</li>
            <li>Pengguna bertanggung jawab atas kerahasiaan akun masing-masing.</li>
          </ul>
        </section>

        <section>
          <h2>2. Pembelian dan Penjualan</h2>
          <p>
            Seluruh produk dijual oleh UMKM mitra kami. PasarDesa berperan sebagai fasilitator.
          </p>
          <ul>
            <li>Harga produk ditentukan oleh penjual.</li>
            <li>Transaksi harus mengikuti prosedur checkout dan pembayaran yang berlaku.</li>
            <li>Pengembalian dan refund tunduk pada kebijakan platform.</li>
          </ul>
        </section>

        <section>
          <h2>3. Pembayaran</h2>
          <p>
            Pembayaran dapat dilakukan melalui metode yang tersedia seperti transfer bank, e-wallet, QRIS, atau COD (jika tersedia).
          </p>
          <ul>
            <li>Pembayaran harus sesuai nomor rekening atau metode yang tertera.</li>
            <li>Transaksi diverifikasi secara otomatis setelah pembayaran berhasil.</li>
          </ul>
        </section>

        <section>
          <h2>4. Privasi dan Keamanan</h2>
          <p>
            PasarDesa menjaga keamanan data dan transaksi pengguna.
          </p>
          <ul>
            <li>Data pengguna bersifat rahasia dan tidak dibagikan pihak ketiga tanpa izin.</li>
            <li>Segala tindakan penipuan akan ditindak tegas sesuai hukum berlaku.</li>
          </ul>
        </section>

        <section>
          <h2>5. Lain-lain</h2>
          <p>
            Syarat & Ketentuan ini dapat diperbarui sewaktu-waktu. Pengguna disarankan untuk memeriksa halaman ini secara berkala.
          </p>
        </section>
      </div>
    </div>
  );
}
