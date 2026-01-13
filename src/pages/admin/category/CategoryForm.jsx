// src/pages/admin/category/CategoryForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../service/api";
import AdminLayout from "../../../components/admin/AdminLayout";

const CategoryForm = () => {
  const { id } = useParams(); // id kategori untuk edit
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika edit, fetch data kategori
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const res = await api.get("/categories"); // public route
          const category = res.data.find((c) => c.id === parseInt(id));
          if (!category) throw new Error("Kategori tidak ditemukan");
          setName(category.name);
        } catch (err) {
          console.error(err);
          alert("Gagal memuat data kategori");
          navigate("/admin/categories");
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Nama kategori tidak boleh kosong");

    try {
      setLoading(true);
      if (id) {
        // UPDATE
        await api.put(`/admin/categories/${id}`, { name });
        alert("Kategori berhasil diperbarui");
      } else {
        // CREATE
        await api.post("/admin/categories", { name });
        alert("Kategori berhasil ditambahkan");
      }
      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors?.name) {
        alert(err.response.data.errors.name[0]);
      } else {
        alert("Gagal menyimpan kategori");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">{id ? "Edit" : "Tambah"} Kategori Produk</h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Kategori</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama kategori"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              className="btn-outline"
              style={{ marginLeft: "10px" }}
              onClick={() => navigate("/admin/categories")}
              disabled={loading}
            >
              Batal
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
