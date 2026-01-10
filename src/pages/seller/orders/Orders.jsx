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

  if (loading) return <p>Loading pesanan...</p>;

  return (
    <main className="orders-page">
      <h1>Pesanan Masuk</h1>
      <p>Daftar pesanan dari pembeli</p>

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
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.customer_name}</td>
                <td>
                  Rp {Number(order.total_price).toLocaleString("id-ID")}
                </td>
                <td>
                  <span className={`status ${order.status}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td>
                  {new Date(order.created_at).toLocaleDateString("id-ID")}
                </td>
                <td>
                  <button
                    className="btn-outline"
                    onClick={() =>
                      navigate(`/seller/orders/${order.id}`)
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
