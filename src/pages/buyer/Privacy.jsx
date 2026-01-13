import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/privacy.css";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="privacy-container">

      <div className="privacy-header">
        <button
          className="privacy-back-icon"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
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

        <h1>Kebijakan Privasi</h1>
      </div>

      <p className="intro">
        Kami di PasarDesa berkomitmen untuk melindungi data pribadi pengguna
        dan menjelaskan bagaimana informasi Anda dikumpulkan, digunakan,
        dan dilindungi saat menggunakan layanan kami.
      </p>

      <section>
        <h2>1. Informasi yang Dikumpulkan</h2>
        <p>Kami dapat mengumpulkan informasi berikut:</p>
        <ul>
          <li>Nama, email, nomor telepon, alamat pengiriman.</li>
          <li>Data transaksi pembelian dan histori pesanan.</li>
          <li>Data penggunaan aplikasi dan interaksi di platform.</li>
        </ul>
      </section>

      <section>
        <h2>2. Cara Data Digunakan</h2>
        <ul>
          <li>Menyediakan layanan dan memproses pesanan Anda.</li>
          <li>Meningkatkan kualitas layanan dan pengalaman pengguna.</li>
          <li>Mengirim informasi penting terkait akun dan promosi.</li>
        </ul>
      </section>

      <section>
        <h2>3. Keamanan Data</h2>
        <p>
          Data Anda disimpan dengan aman menggunakan teknologi enkripsi dan
          prosedur internal untuk mencegah akses tidak sah.
        </p>
      </section>

      <section>
        <h2>4. Hak dan Kewajiban Pengguna</h2>
        <ul>
          <li>Anda berhak meminta akses atau penghapusan data pribadi.</li>
          <li>Anda bertanggung jawab menjaga kerahasiaan akun dan password.</li>
          <li>Harap gunakan layanan sesuai aturan dan etika yang berlaku.</li>
        </ul>
      </section>

      <section>
        <h2>5. Perubahan Kebijakan</h2>
        <p>
          PasarDesa berhak memperbarui kebijakan ini. Perubahan akan diinformasikan
          melalui situs atau aplikasi kami.
        </p>
      </section>

      <div className="privacy-footer">
        © {new Date().getFullYear()} PasarDesa. All rights reserved.
      </div>

    </div>
  );
}
