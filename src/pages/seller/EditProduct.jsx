import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../service/api";
import "../../styles/product-form.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State form produk
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  // State kategori
  const [categories, setCategories] = useState([]);

  // 🔹 Fetch produk
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setForm({
        name: res.data.name,
        category_id: res.data.category_id,
        price: res.data.price,
        stock: res.data.stock,
        description: res.data.description,
        image: null,
      });
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data produk");
    }
  };

  // 🔹 Fetch kategori
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat kategori");
    }
  };

  // 🔹 Jalankan fetch produk & kategori sekaligus
  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchProduct(), fetchCategories()]);
    };
    init();
    // eslint-disable-next-line
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle file upload
  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Produk berhasil diperbarui");
      navigate("/seller");
    } catch (error) {
      console.log(error.response?.data);
      alert("Gagal memperbarui produk");
    }
  };

  return (
    <main className="form-wrapper">
      <div className="form-card">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/seller")}
          aria-label="Kembali"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h1>Edit Produk</h1>
        <p className="subtitle">Perbarui informasi produk Anda</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select
              name="category_id"
              required
              value={form.category_id || ""}
              onChange={handleChange}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Harga</label>
            <input
              type="number"
              name="price"
              required
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Stok</label>
            <input
              type="number"
              name="stock"
              required
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ganti Gambar (Opsional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate("/seller")}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
