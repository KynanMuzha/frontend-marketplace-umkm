import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../service/api";
import "../../styles/product-detail.css";

const BASE_URL = "http://127.0.0.1:8000";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => alert("Produk tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      setToast({ show: true, message: "Silakan login terlebih dahulu" });
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart/add", { product_id: product.id, quantity: 1 });
      setToast({ show: true, message: "Produk berhasil ditambahkan ke keranjang" });
      setTimeout(() => setToast({ show: false, message: "" }), 2500);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Gagal menambahkan produk ke keranjang" });
      setTimeout(() => setToast({ show: false, message: "" }), 2500);
    }
  };

  if (loading) {
  return (
    <div className="page-loader">
      <div className="loader"></div>
    </div>
  );
}

  if (!product) return <p style={{ textAlign: "center" }}>Produk tidak ditemukan</p>;

  return (
    <main className="container product-detail-container">
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

      <div className="product-card shopee-style">
        <button
  className="product-back-btn"
  onClick={() => navigate("/")}
  aria-label="Kembali ke Home"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
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
<span className="product-category product-category-top">
    {product.category?.name || "-"}
  </span>

        <div className="product-detail-img">
          <img
            src={product.image ? `${BASE_URL}/storage/${product.image}` : "/no-image.png"}
            alt={product.name}
          />
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <h3 className="harga">Rp {Number(product.price).toLocaleString("id-ID")}</h3>
          <h3>UMKM:{product.user?.name || "-"}</h3>
          <h3>Stock:{product.stock}</h3>

          <h1>Deskripsi Produk</h1>
          <h3>{product.description || "-"}</h3>

          {/* Tombol +Keranjang */}
          <div className="btn-cart-wrapper">
            <button className="btn-cart" onClick={handleAddToCart}>
              + Keranjang
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
