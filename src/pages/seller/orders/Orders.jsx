import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api";
import "../../../styles/orders.css";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/seller/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <main className="orders-page orders-loading-page">
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Memuat pesanan...</p>
        </div>
      </main>
    );
  }
  return (
    <main className="orders-page">
      <div className="orders-header">
        <div
          className="orders-back"
          onClick={() => navigate("/seller")}
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

        <div>
          <h1>Pesanan Masuk</h1>
          <p>Daftar pesanan dari pembeli</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>Belum ada pesanan</h3>
          <p>Pesanan akan muncul jika ada pembeli</p>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Pembeli</th>
              <th>Produk</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td data-label="No">{index + 1}</td>

                <td data-label="Pembeli">
                  {order.customer_name}
                </td>

                <td
                  data-label="Produk"
                  className="order-products"
                >
                  {order.items?.map((item, i) => (
                    <div key={i}>
                      {item.product?.name ||
                        item.product_name}
                    </div>
                  ))}
                </td>

                <td
                  data-label="Qty"
                  className="order-qty"
                >
                  {order.items?.map((item, i) => (
                    <div key={i}>
                      {item.quantity}
                    </div>
                  ))}
                </td>

                <td data-label="Total">
                  Rp{" "}
                  {Number(order.total ?? 0).toLocaleString(
                    "id-ID"
                  )}
                </td>

                <td data-label="Status">
                  <span
                    className={`status ${order.status}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>

                <td data-label="Tanggal">
                  {new Date(
                    order.created_at
                  ).toLocaleDateString("id-ID")}
                </td>

                <td data-label="Aksi">
                  <button
                    className="btn-outline"
                    onClick={() =>
                      navigate(
                        `/seller/orders/${order.id}`
                      )
                    }
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
