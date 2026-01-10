import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/checkout-success.css";
import { QRCodeCanvas } from "qrcode.react";

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.order) {
    navigate("/");
    return null;
  }

  const { order } = state;

  const paymentMethod = order.payment_method || "";
  const paymentDetail = order.payment_detail;
  const paymentCode = order.payment_code;
  const paymentDue = order.payment_due ? new Date(order.payment_due) : null;

  const isPaymentPending = ["QRIS", "TF_BANK", "E_WALLET"].includes(paymentMethod);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!paymentDue) return;

    const timer = setInterval(() => {
      const diff = paymentDue.getTime() - new Date().getTime();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentDue]);

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="checkout-success-page">
      <div className="success-card">
        <h2>🎉 Pesanan Berhasil Dibuat!</h2>
        <p>Terima kasih telah berbelanja di PasarDesa</p>

        {/* RINGKASAN */}
        <div className="order-summary">
          <h3>Ringkasan Pesanan</h3>

          <div className="summary-row">
            <span>Nomor Pesanan</span>
            <span>{order.id}</span>
          </div>

          <div className="summary-row">
            <span>Total Bayar</span>
            <span>Rp {order.total.toLocaleString("id-ID")}</span>
          </div>

          <div className="summary-row">
            <span>Metode Pembayaran</span>
            <span>{paymentMethod}</span>
          </div>

          {paymentDetail && (
            <div className="summary-row">
              <span>Detail</span>
              <span>{paymentDetail}</span>
            </div>
          )}
        </div>

        {/* PEMBAYARAN */}
        {isPaymentPending ? (
          <div className="payment-info">
            <h3>Instruksi Pembayaran</h3>

            {paymentMethod === "QRIS" && paymentCode && (
              <>
                <p>Scan QR Code berikut:</p>
                <QRCodeCanvas
                  value={paymentCode}
                  size={180}
                />
                <p className="payment-code">{paymentCode}</p>
              </>
            )}

            {paymentMethod === "TF_BANK" && paymentCode && (
              <>
                <p>Transfer ke bank <strong>{paymentDetail}</strong></p>
                <div className="payment-code">{paymentCode}</div>
              </>
            )}

            {paymentMethod === "E_WALLET" && paymentCode && (
              <>
                <p>Bayar via <strong>{paymentDetail}</strong></p>
                <div className="payment-code">{paymentCode}</div>
              </>
            )}

            {paymentDue && (
              <p className="due-date">
                Bayar sebelum {paymentDue.toLocaleString("id-ID")} <br />
                Sisa waktu: {formatTimeLeft(timeLeft)}
              </p>
            )}
          </div>
        ) : (
          <div className="payment-info">
            <h3>Bayar di Tempat (COD)</h3>
            <p>Silakan siapkan pembayaran saat barang datang.</p>
          </div>
        )}

        <button className="btn-home" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
