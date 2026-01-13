import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "../../styles/admin-layout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
