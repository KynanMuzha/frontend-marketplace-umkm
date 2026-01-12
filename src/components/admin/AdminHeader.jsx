import "../../styles/admin-header.css";

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="admin-title">Admin Dashboard</div>

      <div className="admin-actions">
        <span className="admin-name">Admin</span>
        <div className="admin-avatar">A</div>
      </div>
    </header>
  );
};

export default AdminHeader;
