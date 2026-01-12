import "../../styles/about.css";
import { useNavigate } from "react-router-dom";

export default function TentangKami() {
  const navigate = useNavigate();

  return (
    <main className="container about-page">

      <div className="about-header">
        <button
            className="terms-back-icon"
            onClick={() => navigate("/")}
            aria-label="Kembali"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
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

        <h1 className="about-title">Tentang PasarDesa</h1>
        </div>

      <section className="about-section">
        <p>
          PasarDesa adalah platform marketplace digital yang dirancang untuk
          mendukung dan memberdayakan pelaku UMKM desa agar dapat memasarkan
          produknya secara lebih luas melalui teknologi digital.
        </p>
      </section>

      <section className="about-section">
        <h2>Visi</h2>
        <p>
          Menjadi platform digital unggulan dalam pengembangan UMKM desa guna
          memperkuat ekonomi lokal dan meningkatkan kesejahteraan masyarakat desa.
        </p>
      </section>

      <section className="about-section">
        <h2>Misi</h2>
        <ul>
          <li>Menyediakan platform jual beli yang mudah digunakan.</li>
          <li>Mendukung pemasaran produk UMKM desa secara digital.</li>
          <li>Meningkatkan daya saing produk lokal desa.</li>
          <li>Mendorong pertumbuhan ekonomi desa yang berkelanjutan.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Nilai-Nilai Kami</h2>
        <ul>
          <li>Pemberdayaan masyarakat desa</li>
          <li>Transparansi dan kejujuran</li>
          <li>Inovasi berkelanjutan</li>
          <li>Kolaborasi dan kemitraan</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Komitmen Kami</h2>
        <p>
          Kami berkomitmen untuk terus mengembangkan layanan yang membantu UMKM
          desa tumbuh, berkembang, dan mampu bersaing di era ekonomi digital.
        </p>
      </section>

    </main>
  );
}
