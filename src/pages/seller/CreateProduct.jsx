import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import "../../styles/product-form.css";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => alert("Gagal mengambil kategori"));
  }, []);

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      await api.post("/products", formData);

      // ✅ TAMPILKAN ALERT CUSTOM
      setSuccessMessage("Produk berhasil ditambahkan");

      // ✅ Redirect setelah 2 detik
      setTimeout(() => {
        navigate("/seller");
      }, 2000);
    } catch (error) {
      console.error(error.response?.data);
      alert("Gagal menambahkan produk");
    }
  };

  return (
    <>
      {/* ✅ ALERT SUKSES */}
      {successMessage && (
        <div className="alert-success">
          <span className="alert-icon">✔</span>
          <span>{successMessage}</span>
        </div>
      )}

      <main className="form-wrapper">
        <div className="form-card">
          <button
  type="button"
  className="back-button"
  onClick={() => navigate("/seller")}
  aria-label="Kembali"
>
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>

          <h1>Tambah Produk</h1>
          <p className="subtitle">Lengkapi informasi produk UMKM Anda</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Produk</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange} placeholder="Contoh: Keripik Pisang"
              />
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select
                name="category_id"
                required
                value={form.category_id}
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
                onChange={handleChange} placeholder="Contoh: 15000"
              />
            </div>

            <div className="form-group">
              <label>Stok</label>
              <input
                type="number"
                name="stock"
                required
                value={form.stock}
                onChange={handleChange} placeholder="Contoh: 15"
              />
            </div>

            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange} placeholder="Deskripsi singkat produk"
              />
            </div>

            <div className="form-group">
              <label>Gambar Produk</label>
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
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
