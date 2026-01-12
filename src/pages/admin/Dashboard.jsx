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

const StatusBadge = ({ status }) => (
  <span className={`status-badge ${status}`}>
    {status}
  </span>
);

/* =======================
   DASHBOARD PAGE
======================= */

const Dashboard = () => {
  const [summary, setSummary] = useState({
    users: 0,
    categories: 0,
    transactions: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          usersRes,
          categoriesRes,
          transactionsRes,
          ordersRes,
        ] = await Promise.all([
          api.get("/users"),
          api.get("/categories"),
          api.get("/transactions"),
          api.get("/orders"),
        ]);

        const revenue = transactionsRes.data.reduce(
          (total, trx) => total + Number(trx.total || 0),
          0
        );

        setSummary({
          users: usersRes.data.length,
          categories: categoriesRes.data.length,
          transactions: transactionsRes.data.length,
          revenue,
        });

        setOrders(ordersRes.data.slice(0, 5)); // ambil 5 pesanan terbaru
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Dashboard Admin</h1>

        {/* KPI */}
        <div className="kpi-grid">
          <KpiCard title="Total User" value={summary.users} />
          <KpiCard title="Kategori Produk" value={summary.categories} />
          <KpiCard title="Transaksi" value={summary.transactions} />
          <KpiCard
            title="Pendapatan"
            value={`Rp ${summary.revenue.toLocaleString("id-ID")}`}
          />
        </div>

        {/* TABLE */}
        <div className="card">
          <h2 className="section-title">Pesanan Terbaru</h2>

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
                    Tidak ada data
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
