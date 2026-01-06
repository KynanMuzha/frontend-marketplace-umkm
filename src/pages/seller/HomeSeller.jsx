import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/homeseller.css";

const API_URL = "http://localhost:8000";

export default function HomeSeller() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus produk");
    }
  };

  return (
    <>
      <Navbar />

      <main className="seller-wrapper">
        {/* HEADER */}
        <section className="seller-header">
          <div>
            <h1>Dashboard Penjual</h1>
            <p>Kelola seluruh produk UMKM Anda</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/seller/products/create")}
          >
            + Tambah Produk
          </button>
        </section>

        {/* CONTENT */}
        {loading ? (
          <div className="loading">Memuat produk...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <img src="/empty-box.png" alt="Empty" />
            <h3>Belum ada produk</h3>
            <p>Mulai tambahkan produk pertama Anda</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/seller/products/create")}
            >
              Tambah Produk
            </button>
          </div>
        ) : (
          <section className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img
                    src={
                      product.image
                        ? `${API_URL}/storage/${product.image}`
                        : "/no-image.png"
                    }
                    alt={product.name}
                  />
                </div>

                <div className="product-body">
                  <h3>{product.name}</h3>
                  <p className="price">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>

                  <div className="product-actions">
                    <button
                      className="btn-outline"
                      onClick={() =>
                        navigate(`/seller/products/edit/${product.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
