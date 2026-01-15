import UMKM from "../../assets/umkm.jpg";
import UMKM2 from "../../assets/umkm2.jpg";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../service/api";
import "../../styles/home.css";
import HelpChatbot from "../../components/HelpChatbot";
import {
  FaUtensils,
  FaCoffee,
  FaTools,
  FaSeedling,
  FaFish,
  FaLeaf,
  FaBoxOpen
} from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:8000";

export default function Home() {
  const isLoggedIn = !!localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [currentHero, setCurrentHero] = useState(0);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const rawSearch = searchParams.get("search");
  const searchQuery = rawSearch && rawSearch.trim() !== "" ? rawSearch : null;

  const token = localStorage.getItem("token");

  const heroImages = [UMKM, UMKM2];

  const categoryIconMap = {
    1: FaUtensils,
    2: FaCoffee,
    3: FaTools,        // ✅ Kerajinan
    4: FaSeedling,
    5: FaFish,
    6: FaLeaf
  };

  // Efek fade hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Fetch produk
  // Fetch produk (FIXED)
useEffect(() => {
  setProductLoading(true);

  const url = searchQuery
    ? `/products?search=${encodeURIComponent(searchQuery)}`
    : `/products`;

  api
    .get(url)
    .then((res) => setProducts(res.data))
    .catch(() => alert("Gagal memuat produk"))
    .finally(() => {
      setProductLoading(false);
      setPageLoading(false);
    });
}, [searchQuery]);



  // Fetch kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  // Scroll ke hash
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // Scroll ke produk saat search
  useEffect(() => {
    if (searchQuery) {
      const produkSection = document.getElementById("produk-section");
      if (produkSection) {
        produkSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchQuery]);

  const handleClearSearch = () => {
  setSearch("");
  navigate("/", { replace: true });
};


  // Add to cart
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
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.role === "admin") {
    navigate("/admin/dashboard");
  }
}, [navigate]);

  return (
    <>
      {/* PAGE LOADER */}
      {pageLoading && (
        <div className="page-loader">
          <div className="loader"></div>
        </div>
      )}

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

      <section className="hero">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`hero-slide ${currentHero === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="hero-overlay">
              <div className="container hero-content">
  <h1>Marketplace UMKM Desa</h1>
  <p>
    PasarDesa adalah platform jual beli yang dikhususkan untuk UMKM desa.
    Kami membantu pelaku usaha desa memasarkan produk mereka secara digital,
    agar hasil karya dan produk lokal desa bisa dikenal, dibeli, dan berkembang
    di lingkungan desa itu sendiri.
  </p>

  {!isLoggedIn && (
  <div className="hero-single-action">
    <Link to="/login" className="hero-link">
      Masuk
    </Link>

    <span className="hero-separator">|</span>

    <Link to="/register" className="hero-link highlight">
      Daftar Sekarang
    </Link>
  </div>
)}

</div>
            </div>
          </div>
        ))}
      </section>

      <main className="container">
        {/* KATEGORI */}
        <section className="section" id="produk-section">
          <h2 className="section-title">Kategori Produk</h2>

          <div className="kategori-grid">
            {categories.length > 0 ? (
              categories.map((cat) => {
                const Icon = categoryIconMap[cat.id] || FaBoxOpen;

                return (
                  <div
                    key={cat.id}
                    className="kategori-card"
                    onClick={() => navigate(`/kategori/${cat.id}`)}
                  >
                    <div className="kategori-icon">
                      <Icon />
                    </div>
                    <span>{cat.name}</span>
                  </div>
                );
              })
            ) : (
              <p>Memuat kategori...</p>
            )}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">
            {searchQuery ? `Hasil pencarian "${searchQuery}"` : "Produk UMKM Pilihan"}
          </h2>

          {productLoading ? (
            <div className="produk-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="produk-card skeleton"
                  style={{ height: 300 }}
                />
              ))}
            </div>
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
      <HelpChatbot />

    </>
  );
}
