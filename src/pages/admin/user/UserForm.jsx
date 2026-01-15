// src/pages/admin/user/UserForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../service/api";
import AdminLayout from "../../../components/admin/AdminLayout";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);

  // Ambil data user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data user");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.patch(`/admin/users/${id}`, {
        role: user.role,
      });

      alert("Role user berhasil diperbarui");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui role user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Edit Role User</h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama</label>
              <input type="text" value={user.name} disabled />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user.email} disabled />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={user.role}
                onChange={(e) =>
                  setUser({ ...user, role: e.target.value })
                }
              >
                <option value="buyer">Buyer</option>
                <option value="penjual">Penjual</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Tombol — tampilan tetap sama */}
            <div className="form-action-inline">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>

              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate("/admin/users")}
                disabled={loading}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserForm;
