import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../service/api";
import "../../styles/homeseller.css";
import Navbar from "../../components/Navbar";



const PER_PAGE = 4;
const API_URL = "http://127.0.0.1:8000";

export default function HomeSeller() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // 🔴 MODAL KONFIRMASI
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null, // "delete" | "toggle"
    productId: null,
    message: "",
  });

  const location = useLocation();

const searchQuery =
  new URLSearchParams(location.search).get("search") || "";
useEffect(() => {
  setCurrentPage(1);
  fetchProducts(1);
}, [searchQuery]);


  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const openConfirmModal = (action, productId, message) => {
    setConfirmModal({
      show: true,
      action,
      productId,
      message,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      show: false,
      action: null,
      productId: null,
      message: "",
    });
  };

  const fetchProducts = async (page) => {
  try {
    const res = await api.get("/seller/products", {
  params: {
    page,
    per_page: PER_PAGE,
    search: searchQuery,
  },
});


    setProducts(Array.isArray(res.data.data) ? res.data.data : []);
    setCurrentPage(res.data.current_page ?? 1);
    setLastPage(res.data.last_page ?? 1);
  } catch (error) {
    console.error("Fetch products error:", error);
  } finally {
    setLoading(false); // hanya untuk load awal
  }
};

  // ✅ KONFIRMASI HAPUS
  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(currentPage);
      closeConfirmModal();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ TOGGLE STATUS PRODUK
  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/products/${id}/toggle-status`);
      fetchProducts(currentPage);
      closeConfirmModal();
    } catch (error) {
      console.error(error);
    }
  };

  const renderPagination = () => {
  if (lastPage <= 1) return null;

  return (
    <div className="pagination">
      {/* PREV */}
      <button
        className="page-btn icon-btn"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* NUMBER */}
      {[...Array(lastPage)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            className={`page-btn number-btn ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        );
      })}

      {/* NEXT */}
      <button
        className="page-btn icon-btn"
        disabled={currentPage === lastPage}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
};


  return (
    <main className="seller-wrapper">
      {/* HEADER */}
      <section className="seller-header-home">
        <div className="seller-title-home">
          <h1>Dashboard Penjual</h1>
          <p>Kelola seluruh produk UMKM Anda</p>
        </div>

        <div className="seller-actions">
          <button
  className="btn-outline btn-icon"
  onClick={() => navigate("/seller/orders")}
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M3 7L12 2L21 7V17L12 22L3 17V7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M3 7L12 12L21 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 12V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>

  <span>Pesanan Masuk</span>
</button>



          <button
            className="btn-primary"
            onClick={() => navigate("/seller/products/create")}
          >
            + Tambah Produk
          </button>
        </div>
      </section>

      {/* CONTENT */}
      {!loading && products.length === 0 ? (
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
        <>
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
                    Rp{" "}
                    {Number(product.price).toLocaleString("id-ID")}
                  </p>

                  {/* ✅ STATUS PRODUK */}
                  <span
                    className={`status-badge ${product.status}`}
                  >
                    {product.status === "active"
                      ? "Aktif"
                      : "Nonaktif"}
                  </span>

                  {/* ✅ STOK PRODUK */}
                  <p
                    className={
                      product.stock === 0
                        ? "stock-empty"
                        : "stock"
                    }
                  >
                    Stok:{" "}
                    {product.stock === 0
                      ? "Habis"
                      : product.stock}
                  </p>

                  <div className="product-actions">
                    <button
                      className="btn-outline"
                      onClick={() =>
                        navigate(
                          `/seller/products/edit/${product.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() =>
                        openConfirmModal(
                          "toggle",
                          product.id,
                          product.status === "active"
                            ? "Yakin ingin menonaktifkan produk ini?"
                            : "Yakin ingin mengaktifkan produk ini?"
                        )
                      }
                    >
                      {product.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                    </button>

                    <button
                    className="btn-danger"
                    onClick={() =>
                      openConfirmModal(
                        "delete",
                        product.id,
                        "Yakin ingin menghapus produk ini?"
                      )
                    }
                  >
                    Hapus
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {renderPagination()}
        </>
      )}

      {confirmModal.show && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Konfirmasi</h3>
            <p>{confirmModal.message}</p>

            <div className="confirm-actions">
              <button className="btn-outline" onClick={closeConfirmModal}>
                Batal
              </button>

              <button
                className="btn-danger"
                onClick={() => {
                  if (confirmModal.action === "delete") {
                    handleDelete(confirmModal.productId);
                  }

                  if (confirmModal.action === "toggle") {
                    handleToggleStatus(confirmModal.productId);
                  }
                }}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
