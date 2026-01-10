import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../service/api";
import "../../styles/checkout.css";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/cart");
    return null;
  }

  const { items, total } = state;

  const [deliveryType, setDeliveryType] = useState("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const shippingCost = deliveryType === "DELIVERY" ? 5000 : 0;
  const grandTotal = total + shippingCost;

  const handleCheckout = async () => {
    console.log("PAYMENT METHOD (FRONTEND):", paymentMethod);
    console.log("PAYMENT DETAIL (FRONTEND):", paymentDetail);

    if (!name || !address || !phone) {
      alert("Isi nama, alamat, dan nomor HP terlebih dahulu!");
      return;
    }

    if (!paymentMethod) {
      alert("Pilih metode pembayaran");
      return;
    }

    setLoading(true);

    console.log("Checkout Payload:", {
      delivery_type: deliveryType,
      shipping_cost: shippingCost,
      payment_method: paymentMethod,
      payment_detail: paymentDetail,
      customer_name: name,
      customer_address: address,
      customer_phone: phone,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    });

    try {
      // Kirim data checkout ke backend
      const response = await api.post("/checkout", {
        delivery_type: deliveryType,
        shipping_cost: shippingCost,
        payment_method: paymentMethod,
        payment_detail: paymentDetail,
        customer_name: name,
        customer_address: address,
        customer_phone: phone,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      });

      // Navigasi ke halaman sukses dengan mengirim data order via state
      navigate("/checkout-success", {
        state: {
          order: response.data.order,
        },
      });

    } catch (err) {
      alert("Checkout gagal");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-grid">
        {/* LEFT */}
        <div>
          {/* PRODUK */}
          <div className="card">
            <h3>🛒 Produk</h3>
            {items.map((item) => (
              <div key={item.id} className="product-row">
                <div>
                  <strong>{item.product.name}</strong>
                  <p>
                    {item.quantity} x Rp {item.product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <span>
                  Rp {(item.quantity * item.product.price).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* INFORMASI PENGIRIMAN */}
          <div className="card">
            <h3>📦 Informasi Pengiriman</h3>

            <div className="form-group">
              <label>Atas Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama penerima"
              />
            </div>

            <div className="form-group">
              <label>Alamat Rumah</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat lengkap"
              />
            </div>

            <div className="form-group">
              <label>Nomor HP</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
              />
            </div>
          </div>

          {/* PENGIRIMAN */}
          <div className="card">
            <h3>🚚 Pilih Pengiriman</h3>

            <label className="radio-card">
              <input
                type="radio"
                checked={deliveryType === "DELIVERY"}
                onChange={() => setDeliveryType("DELIVERY")}
              />
              <div>
                <strong>Diantar ke Rumah</strong>
                <p>Barang diantar langsung oleh penjual</p>
              </div>
              <span>Rp 5.000</span>
            </label>

            <label className="radio-card">
              <input
                type="radio"
                checked={deliveryType === "PICKUP"}
                onChange={() => setDeliveryType("PICKUP")}
              />
              <div>
                <strong>Ambil di Toko</strong>
                <p>Ambil langsung ke lokasi UMKM</p>
              </div>
              <span>Gratis</span>
            </label>
          </div>

          {/* PEMBAYARAN */}
          <div className="card">
            <h3>💳 Metode Pembayaran</h3>

            <select
              className="select"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentDetail("");
              }}
            >
              <option value="">Pilih Pembayaran</option>
              <option value="QRIS">QRIS</option>
              <option value="TF_BANK">Transfer Bank</option>
              <option value="E_WALLET">E-Wallet</option>
              <option value="COD">COD</option>
            </select>

            {paymentMethod === "TF_BANK" && (
              <select
                className="select"
                onChange={(e) => setPaymentDetail(e.target.value)}
              >
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="BRI">BRI</option>
                <option value="BNI">BNI</option>
                <option value="MANDIRI">MANDIRI</option>
              </select>
            )}

            {paymentMethod === "E_WALLET" && (
              <select
                className="select"
                onChange={(e) => setPaymentDetail(e.target.value)}
              >
                <option value="">Pilih E-Wallet</option>
                <option value="DANA">DANA</option>
                <option value="OVO">OVO</option>
                <option value="GOPAY">GOPAY</option>
                <option value="SHOPEEPAY">SHOPEEPAY</option>
              </select>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="card summary">
          <h3>💰 Ringkasan</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>

          <div className="summary-row">
            <span>Ongkir</span>
            <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
          </div>

          <button
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Buat Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}
