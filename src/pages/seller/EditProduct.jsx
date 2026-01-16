import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../service/api";
import "../../styles/product-form.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, []);

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
      await api.put(`/products/${id}`, formData);

      alert("Produk berhasil diperbarui");
      navigate("/seller");
    } catch (error) {
      console.error(error.response?.data);
      alert("Gagal memperbarui produk");
    }
  };

  return (
    <>

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
                value={form.category_id}
                onChange={handleChange}
              >
                <option value="">Pilih Kategori</option>
                <option value="2">Makanan</option>
                <option value="3">Minuman</option>
                <option value="4">Kerajinan</option>
                <option value="5">Pertanian dan Perkebunan</option>
                <option value="6">Peternakan dan Perikanan</option>
                <option value="7">Produk Herbal</option>
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

    </>
  );
}
