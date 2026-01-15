import { useState, useEffect, useRef } from "react";
import "../styles/chatbot.css";

export default function HelpChatbot() {
  const initialMessages = [
  { from: "bot", text: "Selamat datang di Pusat Bantuan PasarDesa. Silakan pilih topik atau ajukan pertanyaan." }
];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);

  const [input, setInput] = useState("");

  const faqs = [
    "Cara membeli produk",
    "Cara menjadi penjual",
    "Metode pembayaran",
    "Status pesanan",
    "Keamanan akun",
    "Kontak layanan pelanggan",
    "Jam operasional PasarDesa"
  ];
  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const handleFAQ = (text) => {
    addMessage("user", text);
    addMessage("bot", getBotResponse(text));
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage("user", input);
    addMessage("bot", getBotResponse(input));
    setInput("");
  };

  const getBotResponse = (text) => {
    text = text.toLowerCase().trim();

    if (["hai", "halo", "hallo", "hi"].includes(text))
      return "Halo 👋 Selamat datang di PasarDesa! Ada yang bisa kami bantu hari ini?";

    if (text.includes("beli"))
      return "Untuk membeli produk, pilih produk lalu klik tombol Keranjang dan lanjutkan ke pembayaran.";

    if (text.includes("jual"))
      return "Silakan daftar akun lalu masuk ke Dashboard Penjual untuk mulai berjualan.";

    if (text.includes("bayar"))
      return "Kami mendukung pembayaran transfer, e-wallet, dan COD.";

    if (text.includes("pesanan"))
      return "Status pesanan dapat dilihat di menu Pesanan Saya.";

    if (text.includes("akun") || text.includes("keamanan"))
      return "Gunakan password kuat dan jangan bagikan kode OTP kepada siapapun.";

    if (text.includes("kontak"))
      return "Anda dapat menghubungi kami melalui kontak yang tertera di website PasarDesa.";

    if (text.includes("jam"))
      return "Layanan pelanggan PasarDesa aktif setiap hari pukul 08.00 – 20.00 WIB.";

    return "Terima kasih atas pertanyaan Anda. Tim kami siap membantu lebih lanjut.";
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClose = () => {
  setOpen(false);
  setMessages(initialMessages);
  setInput("");
};


  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>PasarDesa Customer Support</span>
            <button onClick={handleClose} className="chatbot-close">
              <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat ${msg.from}`}>
                {msg.text}
              </div>
            ))}

            <div ref={messagesEndRef} />

            <div className="faq-box">
              {faqs.map((faq, i) => (
                <button key={i} onClick={() => handleFAQ(faq)}>
                  {faq}
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan Anda..."
            />
            <button onClick={handleSend} className="send-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        <svg width="26" height="26" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      </button>
    </div>
  );
}
