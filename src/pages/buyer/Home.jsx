import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/home.css";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Marketplace UMKM Desa</h1>
          <p>Temukan produk lokal terbaik langsung dari UMKM desa</p>
        </div>
      </section>

      <main className="container">
        {/* KATEGORI */}
        <section className="section">
          <h2 className="section-title">Kategori Produk</h2>
          <div className="kategori-grid">
            {["Makanan", "Minuman", "Kerajinan", "Pertanian", "Fashion"].map(
              (item, index) => (
                <div className="kategori-card" key={index}>
                  {item}
                </div>
              )
            )}
          </div>
        </section>

        {/* PRODUK */}
        <section className="section">
          <h2 className="section-title">Produk UMKM Pilihan</h2>
          <div className="produk-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div className="produk-card" key={item}>
                <div className="produk-img"></div>
                <div className="produk-body">
                  <h3>Produk UMKM Desa</h3>
                  <p className="harga">Rp 25.000</p>
                  <button className="btn-cart">+ Keranjang</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
