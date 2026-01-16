import { useEffect, useState } from "react";
import api from "../../service/api";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/dashboard.css";

/* ===============================
   Status Badge Component
================================ */
const statusMap = {
  pending: "Menunggu Pembayaran",
  pending_verification: "Menunggu Verifikasi",
  rejected: "Pembayaran Ditolak",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();
  return (
    <span className={`status-badge ${normalizedStatus}`}>
      {statusMap[normalizedStatus] || status}
    </span>
  );
};

/* ===============================
   Orders Page
================================ */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // 🔹 Modal Bukti
  const [modalProof, setModalProof] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    if (!confirm("Yakin ingin mengubah status pesanan?")) return;

    setUpdatingId(orderId);

    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert("Gagal update status");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Kelola Pesanan</h1>

        <div className="card">
          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pembeli</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Bukti Bayar</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty">
                      Belum ada pesanan
                    </td>
                  </tr>
                )}

                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name || "-"}</td>
                    <td>Rp {Number(order.total).toLocaleString("id-ID")}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>

                    {/* ===== Tombol Lihat Bukti ===== */}
                    <td>
                      {order.payment_proof ? (
                        <button
                          className="btn-small"
                          onClick={() =>
                            setModalProof(
                              `https://backend.pasardesa.my.id/storage/${order.payment_proof}`
                            )
                          }
                        >
                          Lihat Bukti
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Menunggu Pembayaran</option>
                        <option value="pending_verification">Menunggu Verifikasi</option>
                        <option value="rejected">Pembayaran Ditolak</option>
                        <option value="processing">Diproses</option>
                        <option value="shipped">Dikirim</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ===== Modal Bukti Pembayaran ===== */}
        {modalProof && (
          <div className="modal-overlay" onClick={() => setModalProof(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button onClick={() => setModalProof(null)}>×</button>
              <img src={modalProof} alt="Bukti Pembayaran" />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
