import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <h2 className="sidebar-title">Admin Panel</h2>

        <nav className="sidebar-menu">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>

          <NavLink to="/admin/categories">
            Kelola Kategori Produk
          </NavLink>

          <NavLink to="/admin/users">
            Kelola User
          </NavLink>

          <NavLink to="/admin/orders">
            Monitoring Transaksi
          </NavLink>

          <NavLink to="/admin/reports">
            Laporan Penjualan
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="logout-sidebar" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
