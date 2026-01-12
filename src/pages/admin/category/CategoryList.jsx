// src/pages/admin/category/CategoryList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api"; // pastikan baseURL axios sudah diatur
import AdminLayout from "../../../components/admin/AdminLayout";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // FETCH CATEGORY
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories"); // <-- public route
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
      alert("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE CATEGORY (admin)
  const deleteCategory = async (id) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      alert("Kategori berhasil dihapus");
      fetchCategories(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus kategori");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Kelola Kategori Produk</h1>

        <button
          className="btn-primary"
          onClick={() => navigate("/admin/categories/new")}
        >
          Tambah Kategori
        </button>

        <div className="card" style={{ marginTop: "20px" }}>
          {loading ? (
            <p>Memuat kategori...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td>{cat.name}</td>
                      <td>
                        <button
                          className="btn-outline"
                          onClick={() =>
                            navigate(`/admin/categories/edit/${cat.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          style={{ marginLeft: "10px" }}
                          onClick={() => deleteCategory(cat.id)}
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

export default CategoryList;
