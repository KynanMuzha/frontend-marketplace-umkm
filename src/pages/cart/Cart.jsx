import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../styles/cart.css";

const API_URL = "http://localhost:8000";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data); // cek struktur API
      setCart(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    try {
      await axios.patch(
        `${API_URL}/api/cart/update`,
        { product_id: productId, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Gagal update qty", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.patch(
        `${API_URL}/api/cart/update`,
        { product_id: productId, quantity: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Gagal hapus item", err);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <h2>Keranjang Belanja</h2>

        {loading ? (
          <p>Memuat...</p>
        ) : cart.length === 0 ? (
          <p className="empty">Keranjang masih kosong</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.product.id}>
                  <img
                    src={item.product.image ? `${API_URL}/storage/${item.product.image}` : "/no-image.png"}
                    alt={item.product.name}
                    className="cart-img"
                  />

                  <div className="cart-info">
                    <h4>{item.product.name}</h4>
                    <p>Rp {item.product.price.toLocaleString("id-ID")}</p>

                    <div className="qty-control">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product.id)}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: Rp {total.toLocaleString("id-ID")}</h3>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
