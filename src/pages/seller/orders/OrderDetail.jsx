import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../service/api";
import "../../../styles/orders.css";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/seller/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.patch(`/seller/orders/${id}/status`, { status });
      fetchOrder();
    } catch (error) {
      console.error(error);
    }
  };

  if (!order) return <p>Loading detail pesanan...</p>;

  return (
    <main className="orders-page">
      <button className="btn-outline" onClick={() => navigate(-1)}>
        ← Kembali
      </button>

      <h1>Detail Pesanan</h1>

      <div className="order-box">
        <p><strong>Pembeli:</strong> {order.customer_name}</p>
        <p><strong>Alamat:</strong> {order.address}</p>
        <p>
          <strong>Total:</strong> Rp{" "}
          {Number(order.total_price).toLocaleString("id-ID")}
        </p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>

      <h3>Produk</h3>
      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.product_name} × {item.quantity}
          </li>
        ))}
      </ul>

      <div className="order-actions">
        <button onClick={() => updateStatus("processing")}>
          Proses
        </button>
        <button onClick={() => updateStatus("shipped")}>
          Kirim
        </button>
        <button onClick={() => updateStatus("completed")}>
          Selesai
        </button>
      </div>
    </main>
  );
}
