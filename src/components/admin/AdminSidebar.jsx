import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // sesuaikan path logo

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
        {/* HEADER */}
        <div className="sidebar-header">
          <img src={logo} alt="PasarDesa Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">PasarDesa</h2>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/categories">Kelola Kategori Produk</NavLink>
          <NavLink to="/admin/users">Kelola User</NavLink>
          <NavLink to="/admin/orders">Monitoring Transaksi</NavLink>
          <NavLink to="/admin/reports">Laporan Penjualan</NavLink>
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
