import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      setSelected([]);
    } catch (err) {
      console.error("Gagal ambil cart", err);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Update quantity (optimistic UI)
  const updateQty = async (cartId, type) => {
    const cartItem = cart.find(item => item.id === cartId);
    if (!cartItem) return;

    let newQty = type === "inc" ? cartItem.quantity + 1 : cartItem.quantity - 1;
    if (newQty < 1) return;

    // 1️⃣ Update state dulu
    setCart(prev =>
      prev.map(item =>
        item.id === cartId ? { ...item, quantity: newQty } : item
      )
    );

    // 2️⃣ Kirim ke backend
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

  // Hapus produk
  const deleteCartItem = async (cartId) => {
    setCart(prev => prev.filter(item => item.id !== cartId));
    setSelected(prev => prev.filter(id => id !== cartId));

    try {
      await axios.delete(`${API_URL}/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Gagal hapus produk", err);
      fetchCart();
    }
  };

  // Checkbox logic
  const toggleProduct = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleShop = (items) => {
    const ids = items.map(item => item.id);
    const allChecked = ids.every(id => selected.includes(id));

    setSelected(prev =>
      allChecked ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  // Group by toko
  const groupedCart = cart.reduce((acc, item) => {
    if (!item.product || !item.product.user) return acc;

    const tokoId = item.product.user.id;
    const tokoName = item.product.user.name;

    if (!acc[tokoId]) acc[tokoId] = { tokoName, items: [] };
    acc[tokoId].items.push(item);
    return acc;
  }, {});

  const total = cart
    .filter(item => selected.includes(item.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // 🌟 Navigasi ke detail produk
  const goToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>

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
                const allChecked = toko.items.every(item =>
                  selected.includes(item.id)
                );

                return (
                  <div key={tokoId} className="cart-wrapper">
                    {/* Header Toko */}
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

                    {/* Produk */}
                    {toko.items.map(item => (
                      <div className="cart-item" key={item.id}>
                        <div className="cart-col checkbox">
                          <input
                            type="checkbox"
                            checked={selected.includes(item.id)}
                            onChange={() => toggleProduct(item.id)}
                          />
                        </div>

                        {/* Gambar */}
                        <div
                          className="cart-col image"
                          onClick={() => goToProductDetail(item.product.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={`${API_URL}/storage/${item.product.image}`}
                            alt={item.product.name}
                            className="cart-img"
                          />
                        </div>

                        {/* Info */}
                        <div
                          className="cart-col info"
                          onClick={(e) => {
                            if (e.target.tagName.toLowerCase() === "button") return;
                            goToProductDetail(item.product.id);
                          }}
                          style={{ cursor: "pointer" }}
                        >
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
              <button className="checkout-btn" disabled={selected.length === 0}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
