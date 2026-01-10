import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/help.css";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "Bagaimana cara mendaftar akun?",
    answer: "Klik tombol 'Daftar' di halaman utama, isi form dengan data yang valid, lalu konfirmasi melalui email atau nomor HP Anda.",
  },
  {
    question: "Bagaimana cara melakukan checkout?",
    answer: "Pilih produk yang diinginkan, masukkan ke keranjang, lanjutkan ke checkout, pilih metode pembayaran, lalu lakukan pembayaran sesuai instruksi.",
  },
  {
    question: "Bagaimana jika pembayaran gagal?",
    answer: "Pastikan saldo dan koneksi internet stabil, kemudian coba ulangi pembayaran. Jika masih gagal, hubungi tim support kami.",
  },
  {
    question: "Bagaimana cara melacak pesanan?",
    answer: "Masuk ke halaman 'Pesanan Saya', pilih pesanan yang ingin dilacak, dan lihat status pengiriman secara real-time.",
  },
  {
    question: "Bagaimana cara melakukan refund?",
    answer: "Refund dapat diajukan melalui halaman pesanan dengan klik 'Ajukan Refund'. Dana akan dikembalikan sesuai metode pembayaran.",
  },
  {
    question: "Apakah barang bisa diambil langsung di toko?",
    answer: "Ya, pilih metode 'Ambil di Toko' saat checkout, lalu datang ke lokasi UMKM untuk mengambil barang.",
  },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-page">

      {/* HEADER */}
      <div className="help-header">
        {/* BACK ICON */}
        <button
          className="help-back-icon"
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

        <h1 className="help-header-title">Pusat Bantuan</h1>
        <p className="help-subtitle">
          Temukan jawaban, tutorial, dan panduan penggunaan untuk transaksi yang nyaman dan aman.
        </p>
      </div>

      {/* FAQ ACCORDION */}
      <section className="help-faq-section">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`help-faq-item ${openIndex === index ? "open" : ""}`}
          >
            <button
              className="help-faq-question"
              onClick={() => toggleAccordion(index)}
            >
              {item.question}
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div className="help-faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
