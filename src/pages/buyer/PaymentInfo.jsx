import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/payment.css";
import {
  QrCode,
  CreditCard,
  Wallet,
  Truck,
  ShieldCheck,
  HelpCircle,
  X,
} from "lucide-react";

export default function PaymentInfo() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const checkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px", color: "#22c55e" }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

  const paymentMethods = [
  {
    id: "qris",
    icon: <QrCode />,
    title: "QRIS",
    description: "Pembayaran cepat melalui semua aplikasi QRIS.",
    details: "Scan QRIS menggunakan aplikasi perbankan atau dompet digital Anda.",
  },
  {
     id: "transfer",
    icon: <CreditCard />,
    title: "Transfer Bank",
    description: "Dukungan transfer ke berbagai bank nasional.",
    details: (
      <>
        <p>Pilih salah satu bank tujuan saat checkout:</p>
        <div className="checklist">
          <div>{checkIcon}BCA</div>
          <div>{checkIcon}BRI</div>
          <div>{checkIcon}BNI</div>
          <div>{checkIcon}MANDIRI</div>
        </div>
        <p>
          Lakukan transfer sesuai nomor rekening yang ditampilkan. Pembayaran akan diverifikasi otomatis.
        </p>
      </>
    ),
  },
  {
    id: "ewallet",
    icon: <Wallet />,
    title: "E-Wallet",
    description: "OVO, DANA, GoPay, dan ShopeePay.",
    details: (
      <>
        <p>Pilih e-wallet pilihan Anda saat checkout. Pilihan tersedia:</p>
        <div className="checklist">
          <div>{checkIcon}DANA</div>
          <div>{checkIcon}OVO</div>
          <div>{checkIcon}GoPay</div>
          <div>{checkIcon}ShopeePay</div>
        </div>
        <p>Lakukan pembayaran melalui aplikasi e-wallet, verifikasi otomatis setelah transaksi berhasil.</p>
      </>
    ),
  },
  {
    id: "cod",
    icon: <Truck />,
    title: "COD",
    description: "Bayar langsung saat barang diterima (jika tersedia).",
    details: "Bayar langsung ke kurir saat produk diterima di alamat Anda.",
  },
];


  const openModal = (method) => {
    setSelectedPayment(method);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="payment-page">
      {/* HEADER */}
      <div className="payment-header">
        <div className="payment-header-top">
          {/* BACK ICON */}
          <button
            className="payment-back-icon"
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

          <h1 className="payment-header-title">Informasi Pembayaran</h1>
        </div>

        <p className="payment-subtitle">
          PasarDesa menyediakan berbagai metode pembayaran aman dan terpercaya
          untuk kenyamanan transaksi Anda.
        </p>
      </div>

      {/* METODE PEMBAYARAN */}
      <section className="payment-section">
        <h2>Metode Pembayaran</h2>
        <div className="payment-grid">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="payment-card"
              onClick={() => openModal(method)}
            >
              {method.icon}
              <h4>{method.title}</h4>
              <p>{method.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalOpen && selectedPayment && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <button
              className="payment-modal-close"
              onClick={closeModal}
              aria-label="Tutup"
            >
              <X />
            </button>
            <div className="payment-modal-content">
              <h3>{selectedPayment.title}</h3>
              <p>{selectedPayment.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* ALUR */}
      <section className="payment-section light">
        <h2>Alur Pembayaran</h2>
        <ol className="payment-steps">
          <li>Pilih produk</li>
          <li>Checkout</li>
          <li>Lakukan pembayaran</li>
          <li>Verifikasi otomatis</li>
        </ol>
      </section>

      {/* KEAMANAN */}
      <section className="payment-section">
        <h2>Keamanan Transaksi</h2>
        <div className="payment-security">
          <div>
            <ShieldCheck />
            <h4>Dana Aman</h4>
            <p>Pembayaran ditahan hingga pesanan diterima.</p>
          </div>
          <div>
            <ShieldCheck />
            <h4>Perlindungan Pembeli</h4>
            <p>Jaminan pengembalian dana jika terjadi masalah.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="payment-section light">
        <h2>FAQ Pembayaran</h2>
        <div className="payment-faq">
          <div>
            <HelpCircle />
            <h4>Pembayaran gagal</h4>
            <p>Pastikan saldo dan koneksi stabil.</p>
          </div>
          <div>
            <HelpCircle />
            <h4>Refund</h4>
            <p>Diproses sesuai metode pembayaran.</p>
          </div>
          <div>
            <HelpCircle />
            <h4>Status pembayaran</h4>
            <p>Dapat dipantau di halaman pesanan.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
