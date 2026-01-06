import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/product.css";

const API_URL = "http://localhost:8000";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/${id}`) // PUBLIC route
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error(err);
        alert("Produk tidak ditemukan");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("Silakan login dulu untuk menambahkan ke keranjang");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/cart/add`, // ✅ endpoint backend yang benar
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Produk berhasil ditambahkan ke keranjang");
    } catch (err) {
      console.error("Gagal menambahkan ke keranjang", err);
      alert("Gagal menambahkan produk ke keranjang");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Memuat produk...</p>;
  if (!product) return <p style={{ textAlign: "center" }}>Produk tidak ditemukan</p>;

  return (
    <>

      <main className="container" style={{ padding: "2rem 0" }}>
        <div className="product-detail-grid">
          {/* Gambar */}
          <div className="product-detail-img">
            <img
              src={product.image ? `${API_URL}/storage/${product.image}` : "/no-image.png"}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Info produk */}
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p><strong>UMKM:</strong> {product.user?.name || "Tidak diketahui"}</p> {/* Nama UMKM */}
            <p className="harga">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Deskripsi:</strong></p>
            <p>{product.description || "-"}</p>

            <button
              className="btn-cart"
              style={{ marginTop: "1rem" }}
              onClick={handleAddToCart}
            >
              + Keranjang
            </button>
          </div>
        </div>
      </main>

    </>
  );
}
