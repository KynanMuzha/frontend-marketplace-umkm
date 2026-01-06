import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/product-form.css";

const API_URL = "http://localhost:8000";

export default function CreateProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

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
      await axios.post(`${API_URL}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Produk berhasil ditambahkan");
      navigate("/seller");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan produk");
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-wrapper">
        <div className="form-card">
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
                onChange={handleChange}
                placeholder="Contoh: Keripik Pisang"
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
                placeholder="Contoh: 15000"
              />
            </div>

            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi singkat produk"
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

      <Footer />
    </>
  );
}
