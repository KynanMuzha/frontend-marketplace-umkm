import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
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
      const res = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    await axios.put(
      `http://localhost:8000/api/cart/${id}`,
      { qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchCart();
  };

  const removeItem = async (id) => {
    await axios.delete(`http://localhost:8000/api/cart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCart();
  };

  const totalHarga = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <h2>Keranjang Belanja</h2>

        {cart.length === 0 ? (
          <p className="empty">Keranjang masih kosong</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-img"
                  />

                  <div className="cart-info">
                    <h4>{item.name}</h4>
                    <p>Rp {item.price.toLocaleString()}</p>

                    <div className="qty-control">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: Rp {totalHarga.toLocaleString()}</h3>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
