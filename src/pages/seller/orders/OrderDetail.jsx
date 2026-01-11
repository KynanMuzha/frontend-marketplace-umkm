import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../service/api";
import "../../../styles/orders.css";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [labelDownloaded, setLabelDownloaded] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/seller/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status, reason = null) => {
  try {
    setUpdating(true);
    await api.patch(`/seller/orders/${id}/status`, {
      status,
      reason,
    });
    await fetchOrder();
  } catch (error) {
    alert("Gagal memperbarui status");
  } finally {
    setUpdating(false);
  }
};

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Pembayaran";
      case "paid":
        return "Sudah Dibayar";
      case "processing":
        return "Diproses";
      case "shipped":
        return "Dikirim";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const downloadShippingLabel = async () => {
  try {
    const res = await api.get(
      `/seller/orders/${id}/shipping-label`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `label-pengiriman-${order.id}.pdf`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    setLabelDownloaded(true);
  } catch (error) {
    alert("Gagal mengunduh label pengiriman");
  }
};

  if (loading) {
    return (
      <main className="orders-page orders-loading-page">
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Memuat detail pesanan...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page order-detail-page">
      <div className="order-detail-top">
       <div
          className="orders-detail-back"
          onClick={() => navigate("/seller/orders")}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

  {/* HEADER */}
  <div className="order-detail-header">
    <h1>Detail Pesanan</h1>
    <p>ID Pesanan #{order.id}</p>
  </div>

  {/* CARD */}
  <div className="order-detail-card">

    {/* STATUS */}
    <div className="order-detail-status">
  <span>Status Pesanan</span>
  <strong className={`status ${order.status}`}>
    {getStatusLabel(order.status)}
  </strong>
</div>


    {/* INFO */}
    <div className="order-detail-info">
  <div>
    <span>Pembeli</span>
    <strong>{order.customer_name}</strong>
  </div>

  <div>
    <span>Alamat</span>
    <strong>{order.customer_address || "-"}</strong>
  </div>

  <div>
    <span>Tanggal</span>
    <strong>
      {new Date(order.created_at).toLocaleDateString("id-ID")}
    </strong>
  </div>
</div>


    {/* PRODUCTS */}
    <div className="order-detail-products">
  {order.items?.map((item, index) => (
    <div className="order-product-row" key={index}>
      <span className="order-product-name">
        {item.product?.name || item.product_name}
      </span>

      <span className="order-product-qty">
        x{item.quantity}
      </span>
    </div>
  ))}
</div>


    {/* TOTAL */}
    <div className="order-detail-total">
      <span className="label">Total Pesanan</span>
      <strong className="value">
        Rp {Number(order.total ?? order.total_price ?? 0).toLocaleString("id-ID")}
      </strong>
    </div>

  </div>

  <div className="order-detail-actions">

  {order.status === "paid" && (
    <>
      <button
        className="btn-process"
        onClick={() => updateStatus("processing")}
      >
        Proses
      </button>

      <button
        className="btn-cancel"
        onClick={() => setShowCancelModal(true)}
      >
        Batalkan Pesanan
      </button>
    </>
  )}

  {order.status === "processing" && (
  <>
    {!labelDownloaded ? (
      <button
        className="btn-label"
        onClick={downloadShippingLabel}
      >
        Download Label Pengiriman
      </button>
    ) : (
      <button
        className="btn-ship"
        onClick={() => updateStatus("shipped")}
      >
        Kirim
      </button>
    )}

    <button
      className="btn-cancel"
      onClick={() => setShowCancelModal(true)}
    >
      Batalkan Pesanan
    </button>
  </>
)}


  {order.status === "shipped" && (
    <button
      className="btn-complete"
      onClick={() => updateStatus("completed")}
    >
      Selesaikan
    </button>
  )}

</div>
</div>

  {showCancelModal && (
  <div className="modal-overlay">
    <div className="modal-card">

      <h3>Batalkan Pesanan</h3>
      <p className="modal-subtitle">
        Mohon pilih alasan pembatalan pesanan.
      </p>

      {/* ALASAN */}
      <div className="modal-field">
        <label>Alasan Pembatalan</label>

        <select
          value={cancelReason}
          onChange={(e) => {
            setCancelReason(e.target.value);
            setCancelError("");
          }}
        >
          <option value="">Pilih alasan</option>
          <option value="stok_habis">Stok produk habis</option>
          <option value="produk_rusak">Produk rusak / tidak layak kirim</option>
          <option value="alamat_tidak_valid">Alamat pembeli tidak valid</option>
          <option value="permintaan_pembeli">Permintaan pembeli</option>
          <option value="lainnya">Alasan lainnya</option>
        </select>

        {cancelError && (
          <span className="modal-error">{cancelError}</span>
        )}
      </div>

      {/* ACTION */}
      <div className="modal-actions">
        <button
          className="btn-modal-secondary"
          onClick={() => {
            setShowCancelModal(false);
            setCancelReason("");
            setCancelError("");
          }}
        >
          Kembali
        </button>

        <button
          className="btn-modal-danger"
          onClick={() => {
            if (!cancelReason) {
              setCancelError("Alasan pembatalan wajib dipilih");
              return;
            }

            updateStatus("cancelled", cancelReason);
            setShowCancelModal(false);
            setCancelReason("");
          }}
        >
          Batalkan Pesanan
        </button>
      </div>

    </div>
  </div>
)}


</main>


  );
}
