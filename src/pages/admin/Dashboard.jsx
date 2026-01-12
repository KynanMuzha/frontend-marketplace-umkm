import { useEffect, useState } from "react";
import api from "../../service/api";
import "../../styles/dashboard.css";
import AdminLayout from "../../components/admin/AdminLayout";

/* =======================
   SMALL COMPONENTS
======================= */

const KpiCard = ({ title, value }) => (
  <div className="kpi-card">
    <p className="kpi-title">{title}</p>
    <h2 className="kpi-value">{value}</h2>
  </div>
);

/* 🔹 STATUS TRANSLATION */
const STATUS_LABEL = {
  pending: "Pending",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  return (
    <span className={`status-badge ${normalizedStatus}`}>
      {STATUS_LABEL[normalizedStatus] || status}
    </span>
  );
};

/* =======================
   DASHBOARD PAGE
======================= */

const Dashboard = () => {
  const [summary, setSummary] = useState({
    users: 0,
    transactions: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/orders"),
        ]);

        if (!isMounted) return;

        const ordersData = ordersRes.data;

        /* ✅ revenue dihitung dari COMPLETED */
        const revenue = ordersData
          .filter(o => o.status === "completed")
          .reduce((total, o) => total + Number(o.total || 0), 0);

        const sortedOrders = [...ordersData].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setSummary({
          users: usersRes.data.length,
          transactions: ordersData.length,
          revenue,
        });

        setOrders(sortedOrders.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboard(); // load awal

    const interval = setInterval(fetchDashboard, 10000); // auto refresh 10 detik

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Dashboard Admin</h1>

        {/* KPI */}
        <div className="kpi-grid">
          <KpiCard title="Total User" value={summary.users} />
          <KpiCard title="Total Transaksi" value={summary.transactions} />
          <KpiCard
            title="Pendapatan"
            value={`Rp ${summary.revenue.toLocaleString("id-ID")}`}
          />
        </div>

        {/* TABLE */}
        <div className="card">
          <h2 className="section-title">Pesanan Terbaru</h2>

          {loading ? (
            <p className="loading">Memuat data...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pembeli</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty">
                      Belum ada pesanan
                    </td>
                  </tr>
                )}

                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user?.name || "-"}</td>
                    <td>
                      Rp {Number(order.total).toLocaleString("id-ID")}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
