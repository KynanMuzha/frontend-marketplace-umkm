// src/pages/admin/user/UserList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api";
import AdminLayout from "../../../components/admin/AdminLayout";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil semua user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users"); // backend: AdminController@listUsers
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      alert("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hapus user
  const deleteUser = async (id) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await api.delete(`/admin/users/${id}`); // AdminController@deleteUser
      alert("User berhasil dihapus");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus user");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Kelola User</h1>

        <div className="card" style={{ marginTop: "20px" }}>
          {loading ? (
            <p>Memuat user...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn-outline"
                          onClick={() =>
                            navigate(`/admin/users/edit/${user.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          style={{ marginLeft: "10px" }}
                          onClick={() => deleteUser(user.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserList;
