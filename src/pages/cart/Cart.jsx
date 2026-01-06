import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/cart.css";

const API_URL = "http://localhost:8000";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data ?? [];
      setCart(items);

      // ❌ jangan auto-check semua (lebih aman)
      setSelected([]);
    } catch (err) {
      console.error("Gagal ambil cart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (cartId, type) => {
    const cartItem = cart.find(item => item.id === cartId);
    if (!cartItem) return;

    let newQty = type === "inc" ? cartItem.quantity + 1 : cartItem.quantity - 1;
    if (newQty < 1) return;

    // 1️⃣ Optimistic UI → langsung update state
    setCart(prev =>
      prev.map(item =>
        item.id === cartId ? { ...item, quantity: newQty } : item
      )
    );

    // 2️⃣ Kirim ke backend (async, tidak blocking UI)
    try {
      await axios.patch(
        `${API_URL}/api/cart/update`,
        { product_id: cartItem.product.id, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Gagal update qty:", err);
      fetchCart(); // rollback jika gagal
    }
  };

  const deleteCartItem = async (cartId) => {
    // optimistik UI → langsung hilangkan di layar
    setCart((prev) => prev.filter((item) => item.id !== cartId));
    setSelected((prev) => prev.filter((id) => id !== cartId));

    try {
      await axios.delete(`${API_URL}/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Gagal hapus produk", err);
      fetchCart(); // rollback kalau gagal
    }
  };

  /* =====================
     CHECKBOX LOGIC
  ===================== */

  const toggleProduct = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleShop = (items) => {
    const ids = items.map((item) => item.id);
    const allChecked = ids.every((id) => selected.includes(id));

    setSelected((prev) =>
      allChecked
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])]
    );
  };

  /* =====================
     GROUP BY TOKO (BENAR)
  ===================== */

  const groupedCart = cart.reduce((acc, item) => {
    if (!item.product || !item.product.user) return acc;

    const tokoId = item.product.user.id;
    const tokoName = item.product.user.name;

    if (!acc[tokoId]) {
      acc[tokoId] = {
        tokoName,
        items: [],
      };
    }

    acc[tokoId].items.push(item);
    return acc;
  }, {});

  const total = cart
    .filter((item) => selected.includes(item.id))
    .reduce(
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
              {Object.entries(groupedCart).map(([tokoId, toko]) => {
                const allChecked = toko.items.every((item) =>
                  selected.includes(item.id)
                );

                return (
                  <div key={tokoId} className="cart-wrapper">
                    {/* HEADER TOKO */}
                    <div className="cart-shop">
                      <div className="cart-col checkbox">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={() => toggleShop(toko.items)}
                        />
                      </div>

                      <span className="shop-name">{toko.tokoName}</span>
                    </div>

                    {/* PRODUK */}
                    {toko.items.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <div className="cart-col checkbox">
                          <input
                            type="checkbox"
                            checked={selected.includes(item.id)}
                            onChange={() => toggleProduct(item.id)}
                          />
                        </div>

                        <div className="cart-col image">
                          <img
                            src={`${API_URL}/storage/${item.product.image}`}
                            alt={item.product.name}
                            className="cart-img"
                          />
                        </div>

                        <div className="cart-col info">
                          <h4>{item.product.name}</h4>
                          <p>Rp {item.product.price.toLocaleString("id-ID")}</p>

                          <div className="qty-control">
                              <button onClick={() => updateQty(item.id, "dec")}>−</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQty(item.id, "inc")}>+</button>
                          </div>
                        </div>

                        <div className="cart-col price">
                          Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                        </div>

                        <div className="cart-col delete">
                          <button
                            className="cart-delete"
                            onClick={() => deleteCartItem(item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h3>Total: Rp {total.toLocaleString("id-ID")}</h3>
              <button
                className="checkout-btn"
                disabled={selected.length === 0}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
