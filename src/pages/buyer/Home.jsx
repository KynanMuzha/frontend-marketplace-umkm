import UMKM from "../../assets/umkm.jpg";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../../service/api";
import "../../styles/home.css";

const BASE_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Fetch produk
  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Gagal memuat produk"))
      .finally(() => setLoading(false));
  }, []);

  // Fetch kategori dari backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories"); // endpoint backend kategori
        setCategories(res.data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  // Scroll ke hash jika ada
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Tambah ke keranjang
  const handleAddToCart = (productId) => {
    if (!token) {
      setToast({ show: true, message: "Silakan login terlebih dahulu" });
      navigate("/login");
      return;
    }

    api
      .post("/cart/add", { product_id: productId, quantity: 1 })
      .then(() => {
        setToast({ show: true, message: "Produk berhasil ditambahkan ke keranjang" });
        setTimeout(() => setToast({ show: false, message: "" }), 2500);
      })
      .catch(() => {
        setToast({ show: true, message: "Gagal menambahkan produk ke keranjang" });
        setTimeout(() => setToast({ show: false, message: "" }), 2500);
      });
  };

  return (
    <>
      {/* Toast */}
      {toast.show && (
        <div className="toast">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="toast-icon"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      {/* HERO */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${UMKM})` }}
      >
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1>Marketplace UMKM Desa</h1>
            <p>PasarDesa adalah platform jual beli yang dikhususkan untuk UMKM desa. Kami membantu pelaku usaha desa memasarkan produk mereka secara digital, agar hasil karya dan produk lokal desa bisa dikenal, dibeli, dan berkembang di lingkungan desa itu sendiri.</p>
          </div>
        </div>
      </section>

      <main className="container">
        {/* KATEGORI */}
        <section className="section" id="produk-section">
          <h2 className="section-title">Kategori Produk</h2>
          <div className="kategori-grid">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="kategori-card"
                  onClick={() => navigate(`/kategori/${cat.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="kategori-icon-placeholder">{cat.name.charAt(0)}</div>
                  <span>{cat.name}</span>
                </div>
              ))
            ) : (
              <p>Memuat kategori...</p>
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
