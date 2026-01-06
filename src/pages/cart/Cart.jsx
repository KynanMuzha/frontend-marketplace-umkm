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
    let finalQty = 0;

    // 1️⃣ optimistic UI
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== cartId) return item;

        finalQty =
          type === "inc"
            ? item.quantity + 1
            : item.quantity - 1;

        if (finalQty < 1) return item;

        return { ...item, quantity: finalQty };
      })
    );

    if (finalQty < 1) return;

    // 2️⃣ backend sync (TransactionController)
    try {
      await axios.patch(
        `${API_URL}/api/transactions/${cartId}`,
        { quantity: finalQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Update qty gagal", err);
      fetchCart(); // rollback
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
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => toggleShop(toko.items)}
                      />
                      <span className="shop-name">{toko.tokoName}</span>
                    </div>

                    {/* PRODUK */}
                    {toko.items.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleProduct(item.id)}
                        />

                        <img
                          src={`${API_URL}/storage/${item.product.image}`}
                          alt={item.product.name}
                          className="cart-img"
                          onError={(e) =>
                            (e.target.src = "/no-image.png")
                          }
                        />

                        <div className="cart-info">
                          <h4>{item.product.name}</h4>
                          <p>
                            Rp{" "}
                            {item.product.price.toLocaleString("id-ID")}
                          </p>

                          <div className="qty-control">
                            <button onClick={() => updateQty(item.id, "dec")}>
                              −
                            </button>

                            <span className="qty">
                              {item.quantity}
                            </span>

                            <button onClick={() => updateQty(item.id, "inc")}>
                              +
                            </button>
                          </div>
                        </div>

                        <div className="cart-price">
                          Rp{" "}
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString("id-ID")}
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
