import { useNavigate } from "react-router-dom";
import "../../styles/shipping.css";
import { Truck, MapPin } from "lucide-react";

export default function ShippingInfo() {
  const navigate = useNavigate();

  const shippingMethods = [
    {
      id: "home-delivery",
      icon: <Truck />,
      title: "Diantar ke Rumah",
      description:
        "Barang diantar langsung oleh penjual ke alamat Anda.",
      fee: "Tambahan biaya Rp 5.000",
    },
    {
      id: "pickup",
      icon: <MapPin />,
      title: "Ambil di Toko",
      description: "Ambil langsung ke lokasi UMKM sesuai alamat toko.",
      fee: "Gratis",
    },
  ];

  return (
    <div className="shipping-page">
      {/* HEADER */}
      <div className="shipping-header">
  <div className="shipping-header-top">
    <button
      className="shipping-back-icon"
      onClick={() => navigate("/")}
      aria-label="Kembali"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <h1 className="shipping-header-title">Informasi Pengiriman</h1>
  </div>
  <p className="shipping-subtitle">
    Pilih metode pengiriman yang sesuai dengan kebutuhan Anda. Platform kami menyediakan layanan pengiriman yang fleksibel dan aman untuk kenyamanan Anda.
  </p>
</div>


      {/* SHIPPING METHODS */}
      <section className="shipping-section">
        <div className="shipping-grid">
          {shippingMethods.map((method) => (
            <div key={method.id} className="shipping-card">
              <div className="shipping-icon">{method.icon}</div>
              <h4>{method.title}</h4>
              <p>{method.description}</p>
              <p className="shipping-fee">{method.fee}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
