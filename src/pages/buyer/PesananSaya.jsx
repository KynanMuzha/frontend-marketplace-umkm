import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pesanan.css";

const STATUS_LIST = [
  "Menunggu Pembayaran",      // pending
  "Menunggu Verifikasi",      // pending_verification
  "Pembayaran Ditolak",       // rejected
  "Diproses",                 // processing
  "Dikirim",                  // shipped
  "Selesai",                  // completed
  "Dibatalkan"                // cancelled
];

export default function PesananSaya() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("Menunggu Pembayaran");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 AMBIL DATA DARI BACKEND
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8000/api/orders/history", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setOrders(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil pesanan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // 🔥 FILTER BERDASARKAN STATUS
 const filteredOrders = orders.filter(
  (order) => order.status.label === activeStatus
);

  return (
    <div className="orders-page">
      {/* HEADER */}
      <div className="orders-header">
        <button className="orders-back" onClick={() => navigate(-1)}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1>Pesanan Saya</h1>
      </div>

      {/* STATUS TABS */}
      <div className="orders-tabs">
        {STATUS_LIST.map((status) => (
          <button
            key={status}
            className={`orders-tab ${activeStatus === status ? "active" : ""}`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* LIST PESANAN */}
      <div className="orders-list">
        {loading ? (
          <div className="orders-empty">Memuat pesanan...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            Belum ada pesanan dengan status ini
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
                key={order.id}
                className="order-card"
                style={{ cursor: "pointer" }}
                onClick={() =>
                navigate("/checkout-success", {
                    state: { order },
                })
                }
            >
              <div className="order-top">
                <span className="order-id">{order.invoice}</span>
                <span className={`order-status ${order.status.code}`}>
                {order.status.label}
                </span>
              </div>

              <div className="order-body">
                <h4>{order.product}</h4>
                <p>{order.seller}</p>
              </div>

              <div className="order-footer">
                <span>Total</span>
                <strong>
                  Rp {Number(order.price).toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
