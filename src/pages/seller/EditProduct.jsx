import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/product-form.css";

const API_URL = "http://localhost:8000";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        name: res.data.name,
        price: res.data.price,
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
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      await axios.post(`${API_URL}/api/products/${id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Produk berhasil diperbarui");
      navigate("/seller");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui produk");
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-wrapper">
        <div className="form-card">
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

      <Footer />
    </>
  );
}
