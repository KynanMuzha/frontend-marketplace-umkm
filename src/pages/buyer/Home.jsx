import Pemandangan from "../../assets/pemandangan.jpg";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import "../../styles/home.css";

const BASE_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Gagal memuat produk"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (productId) => {
    if (!token) {
      alert("Silakan login dulu untuk menambahkan ke keranjang");
      navigate("/login");
      return;
    }

    api
      .post("/cart/add", {
        product_id: productId,
        quantity: 1,
      })
      .then(() => alert("Produk berhasil ditambahkan ke keranjang"))
      .catch(() => alert("Gagal menambahkan produk ke keranjang"));
  };

  return (
    <>
      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${Pemandangan})`,
        }}
      >
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1>Marketplace UMKM Desa</h1>
            <p>Temukan produk lokal terbaik langsung dari UMKM desa</p>
          </div>
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

          {loading ? (
            <p>Memuat produk...</p>
          ) : products.length === 0 ? (
            <p>Belum ada produk</p>
          ) : (
            <div className="produk-grid">
              {products.map((product) => (
                <div className="produk-card" key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="produk-img">
                      <img
                        src={
                          product.image
                            ? `${BASE_URL}/storage/${product.image}`
                            : "/no-image.png"
                        }
                        alt={product.name}
                      />
                    </div>

                    <div className="produk-body">
                      <h3>{product.name}</h3>
                      <p className="harga">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </Link>

                  <button
                    className="btn-cart"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    + Keranjang
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
