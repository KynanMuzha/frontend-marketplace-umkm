import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import "../../styles/home.css"; // pakai CSS home agar card sama

const BASE_URL = "http://127.0.0.1:8000";

export default function KategoriProduk() {
  const { slug } = useParams(); // ambil slug dari URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Konversi slug ke nama kategori sesuai backend
  const formatCategoryName = (slug) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const categoryName = formatCategoryName(slug);

  // Fetch produk berdasarkan kategori
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products?category=${categoryName}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Gagal memuat produk kategori:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

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
    <div className="container category-container">
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

      {/* Judul kategori */}
      <div className="category-header">
  <button
    className="back-button"
    onClick={() => navigate("/")}
    aria-label="Kembali ke Home"
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>

  <h2 className="section-title">
    Produk Kategori: {categoryName}
  </h2>
</div>


      {/* Produk */}
      {loading ? (
  <div className="page-loader">
    <div className="loader"></div>
  </div>
) : products.length === 0 ? (
  <p className="empty-category-text">
  Belum ada produk di kategori ini
</p>

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
                    src={product.image ? `${BASE_URL}/storage/${product.image}` : "/no-image.png"}
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
    </div>
  );
}
