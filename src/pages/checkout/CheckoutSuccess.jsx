import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../service/api";
import "../../styles/checkout-success.css";
import { QRCodeCanvas } from "qrcode.react";

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.order) {
    return null;
  }

  const { order } = state;

  console.log("Order state:", order);

  // NORMALISASI STATUS
  const status =
    typeof order.status === "object" ? order.status.code : order.status;

  const paymentMethod = order.payment_method || "";
  const paymentDetail = order.payment_detail || "";
  const paymentCode = order.payment_code || "";
  const paymentDue = order.payment_due ? new Date(order.payment_due) : null;

  const isPaymentPending = ["QRIS", "TF_BANK", "E_WALLET"].includes(paymentMethod);

  const [timeLeft, setTimeLeft] = useState(0);

  const [proof, setProof] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // ================== HITUNG TOTAL ==================
  const totalBayar =
    order.total ??
    order.price ??
    (order.items?.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) * Number(item.quantity || 0),
      0
    ) ?? 0);
  
  const handleUploadProof = async () => {
  if (!proof) return alert("Pilih gambar bukti pembayaran");

  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("proof", proof);

    await api.post(`/orders/${order.id}/upload-proof`, formData);

    alert("Bukti pembayaran berhasil dikirim");
        navigate(0); // refresh halaman
      } catch (err) {
        alert("Gagal upload bukti pembayaran");
      } finally {
        setUploading(false);
      }
    };

  return (
    <div className="checkout-success-page">
      <div className="success-card">
        {/* ===== JUDUL DINAMIS ===== */}
        <h2>
          {status === "pending" && "Menunggu Pembayaran"}
          {status === "pending_verification" && "Menunggu Verifikasi"}
          {status === "processing" && "Pesanan Diproses"}
          {status === "shipped" && "Pesanan Dikirim"}
          {status === "completed" && "Pesanan Selesai"}
          {status === "cancelled" && "Pesanan Dibatalkan"}
          {status === "rejected" && "Pembayaran Ditolak"}
        </h2>

        <p>
          {status === "pending" && "Segera selesaikan pembayaran Anda"}
          {status === "pending_verification" &&
            "Bukti pembayaran telah dikirim dan menunggu verifikasi admin"}
          {status === "processing" && "Pesanan sedang disiapkan oleh penjual"}
          {status === "shipped" && "Pesanan sedang dalam perjalanan"}
          {status === "completed" &&
            "Terima kasih telah berbelanja di PasarDesa"}
          {status === "cancelled" &&
            "Pesanan dibatalkan karena melewati batas waktu pembayaran"}
          {status === "rejected" &&
            "Bukti pembayaran ditolak. Silakan upload ulang"}
        </p>

        {/* ===== RINGKASAN PESANAN ===== */}
        <div className="order-summary">
          <h3>Ringkasan Pesanan</h3>

          <div className="summary-row">
            <span>Nomor Pesanan</span>
            <span>{order.invoice || order.id}</span>
          </div>

          {/* Daftar item */}
          {order.items && order.items.length > 0 && (
            <div className="items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="summary-row">
                  <span>
                    {item.product?.name || item.name} x {item.quantity}
                  </span>
                  <span>
                    Rp{" "}
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Total Bayar */}
          <div className="summary-row total">
            <span>Total Bayar</span>
            <span>
              Rp {Number(totalBayar || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="summary-row">
            <span>Metode Pembayaran</span>
            <span>{paymentMethod || "COD"}</span>
          </div>

          {paymentDetail && (
            <div className="summary-row">
              <span>Detail</span>
              <span>{paymentDetail}</span>
            </div>
          )}
        </div>

        {/* ===== MENUNGGU PEMBAYARAN ===== */}
        {status === "pending" && isPaymentPending && (
            <div className="payment-info">
              <h3>Instruksi Pembayaran</h3>

              {paymentMethod === "QRIS" && paymentCode && (
                <>
                  <p>Scan QR Code berikut:</p>
                  <QRCodeCanvas value={paymentCode} size={180} />
                  <p className="payment-code">{paymentCode}</p>
                </>
              )}

              {paymentMethod === "TF_BANK" && paymentCode && (
                <>
                  <p>
                    Transfer ke bank <strong>{paymentDetail}</strong>
                  </p>
                  <div className="payment-code">{paymentCode}</div>
                </>
              )}

              {paymentMethod === "E_WALLET" && paymentCode && (
                <>
                  <p>
                    Bayar via <strong>{paymentDetail}</strong>
                  </p>
                  <div className="payment-code">{paymentCode}</div>
                </>
              )}

              {paymentDue && (
                <p className="due-date">
                  Bayar sebelum {paymentDue.toLocaleString("id-ID")}
                  <br />
                  Sisa waktu: {formatTimeLeft(timeLeft)}
                </p>
              )}

              {/* UPLOAD BUKTI */}
              <div className="upload-proof">
                <label className="upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProof(e.target.files[0])}
                    hidden
                  />

                  <div className="upload-content">
                    <span className="upload-icon">📤</span>
                    <p>
                      {proof ? proof.name : "Klik untuk pilih bukti pembayaran"}
                    </p>
                  </div>
                </label>

                <button
                  className="btn-upload"
                  onClick={handleUploadProof}
                  disabled={uploading}
                >
                  {uploading ? "Mengirim..." : "Upload Bukti Pembayaran"}
                </button>
              </div>
            </div>
          )}

        {/* ===== COD ===== */}
        {status === "pending" && !isPaymentPending && (
          <div className="payment-info">
            <h3>Bayar di Tempat (COD)</h3>
            <p>Silakan siapkan pembayaran saat barang datang.</p>
          </div>
        )}

        {/* ===== MENUNGGU VERIFIKASI ===== */}
        {status === "pending_verification" && (
          <div className="payment-info">
            <h3>Menunggu Verifikasi</h3>
            <p>
              Bukti pembayaran telah dikirim.
              <br />
              Admin akan memverifikasi pembayaran Anda.
            </p>
          </div>
        )}

        {/* ===== PEMBAYARAN DITOLAK ===== */}
        {status === "rejected" && (
          <div className="payment-info">
            <h3>Pembayaran Ditolak</h3>
            <p>Silakan upload ulang bukti pembayaran</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProof(e.target.files[0])}
            />

            <button onClick={handleUploadProof} disabled={uploading}>
              {uploading ? "Mengirim..." : "Upload Ulang Bukti"}
            </button>
          </div>
        )}

        {/* ===== STATUS LAIN ===== */}
        {status === "processing" && (
          <div className="payment-info">
            <h3>Pesanan Sedang Diproses</h3>
            <p>Penjual sedang menyiapkan pesanan Anda.</p>
          </div>
        )}

        {status === "shipped" && (
          <div className="payment-info">
            <h3>Pesanan Dikirim</h3>
            <p>Pesanan sedang dalam perjalanan.</p>
          </div>
        )}

        {status === "completed" && (
          <div className="payment-info success">
            <h3>Pesanan Selesai</h3>
            <p>Terima kasih telah berbelanja</p>
          </div>
        )}

        {status === "cancelled" && (
          <div className="payment-info cancelled">
            <h3>Pesanan Dibatalkan</h3>
            <p>
              Pesanan dibatalkan otomatis karena melewati batas waktu pembayaran.
            </p>
          </div>
        )}

        <button className="btn-home" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
