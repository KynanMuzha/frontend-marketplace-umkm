import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import "../../styles/cart.css";

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
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const items = res.data ?? [];
      setCart(items);
      setSelected([]);
    } catch (err) {
      console.error("Gagal ambil cart", err);
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQty = async (cartId, type) => {
    const cartItem = cart.find((item) => item.id === cartId);
    if (!cartItem) return;

    let newQty = type === "inc" ? cartItem.quantity + 1 : cartItem.quantity - 1;
    if (newQty < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === cartId ? { ...item, quantity: newQty } : item
      )
    );

    try {
      await api.patch("/cart/update", {
        product_id: cartItem.product.id,
        quantity: newQty,
      });
    } catch (err) {
      console.error("Gagal update qty:", err);
      fetchCart(); // rollback jika gagal
    }
  };

  // Hapus produk
  const deleteCartItem = async (cartId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartId));
    setSelected((prev) => prev.filter((id) => id !== cartId));

    try {
      await api.delete(`/cart/${cartId}`);
    } catch (err) {
      console.error("Gagal hapus produk", err);
      fetchCart();
    }
  };

  // Checkbox logic
  const toggleProduct = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
    .filter((item) => selected.includes(item.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const goToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCheckout = () => {
    if (selected.length === 0) return;

    const selectedItems = cart.filter((item) => selected.includes(item.id));

    navigate("/checkout", {
      state: {
        items: selectedItems,
        total,
      },
    });
  };

  return (
    <div className="cart-page">
       <div className="cart-header">
  <button className="back-btn" onClick={() => navigate("/")}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  </button>

  <h2 className="cart-title">Keranjang Belanja</h2>
  </div>

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
                  {toko.items.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-col checkbox">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleProduct(item.id)}
                        />
                      </div>

                      <div
                        className="cart-col image"
                        onClick={() => goToProductDetail(item.product.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={`https://backend.pasardesa.my.id/${item.product.image}`}
                          alt={item.product.name}
                          className="cart-img"
                        />
                      </div>

                      <div
                        className="cart-col info"
                        onClick={(e) => {
                          if (e.target.tagName.toLowerCase() === "button")
                            return;
                          goToProductDetail(item.product.id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <h4>{item.product.name}</h4>
                        <p>Rp {item.product.price.toLocaleString("id-ID")}</p>

                        <div className="qty-control">
                          <button onClick={() => updateQty(item.id, "dec")}>
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, "inc")}>
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-col price">
                        Rp{" "}
                        {(item.product.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
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
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
