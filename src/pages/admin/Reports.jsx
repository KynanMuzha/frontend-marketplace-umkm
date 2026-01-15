// Reports.jsx
import { useEffect, useState } from "react";
import api from "../../service/api";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/dashboard.css";

// EXPORT
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* =======================
     FETCH REPORT
  ======================= */
  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/reports/sales", {
        params: {
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        },
      });

      setReports(res.data);
    } catch (err) {
      console.error("Fetch report error:", err);
      alert("Gagal memuat laporan penjualan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  /* =======================
     TOTAL OMZET
  ======================= */
  const totalRevenue = reports.reduce(
    (total, item) => total + Number(item.total_sales || 0),
    0
  );

  /* =======================
     EXPORT EXCEL
  ======================= */
  const exportExcel = () => {
  if (!reports.length) return alert("Data kosong, tidak bisa export.");

  const data = reports.map(item => ({
    Produk: item.product?.name || "-",
    "Jumlah Terjual": item.total_qty,
    "Total Penjualan": item.total_sales,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Buat semua kolom center
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for(let R = range.s.r; R <= range.e.r; ++R) {
    for(let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = {c:C, r:R};
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if(!worksheet[cell_ref]) continue;
      worksheet[cell_ref].s = { alignment: { horizontal: "center", vertical: "center" } };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true,
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "laporan-penjualan.xlsx");
};


  /* =======================
     EXPORT PDF
  ======================= */
  const exportPDF = () => {
    if (!reports.length) return alert("Data kosong, tidak bisa export.");

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Laporan Penjualan", 14, 15);

    if (startDate || endDate) {
        doc.setFontSize(10);
        doc.text(`Periode: ${startDate || "-"} s/d ${endDate || "-"}`, 14, 22);
    }

    const tableData = reports.map(item => [
        item.product?.name || "-",
        item.total_qty,
        `Rp ${Number(item.total_sales).toLocaleString("id-ID")}`,
    ]);

    // Gunakan autoTable dari import default
    autoTable(doc, {
        startY: 28,
        head: [["Produk", "Jumlah Terjual", "Total Penjualan"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const totalRevenue = reports.reduce(
        (total, item) => total + Number(item.total_sales || 0),
        0
    );

    const finalY = doc.lastAutoTable?.finalY || 28;
    doc.setFontSize(12);
    doc.text(`Total Omzet: Rp ${totalRevenue.toLocaleString("id-ID")}`, 14, finalY + 10);

    doc.save("laporan-penjualan.pdf");
};

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Laporan Penjualan</h1>

        {/* FILTER & EXPORT */}
        <div className="card filter-card">
          <div className="filter-group">
            <div>
              <label>Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label>Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>

            <button className="btn-primary" onClick={fetchReport}>
              Terapkan
            </button>

            <button
              className="btn-outline"
              onClick={exportExcel}
              disabled={reports.length === 0 || loading}
            >
              Export Excel
            </button>

            <button
              className="btn-outline"
              onClick={exportPDF}
              disabled={reports.length === 0 || loading}
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="card">
          {loading ? (
            <p className="loading">Memuat laporan...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Jumlah Terjual</th>
                  <th>Total Penjualan</th>
                </tr>
              </thead>

              <tbody>
                {reports.length === 0 && (
                  <tr>
                    <td colSpan="3" className="empty">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}

                {reports.map(item => (
                  <tr key={item.product_id}>
                    <td>{item.product?.name || "-"}</td>
                    <td>{item.total_qty}</td>
                    <td>
                      Rp {Number(item.total_sales).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>

              {reports.length > 0 && (
                <tfoot>
                  <tr>
                    <th colSpan="2">TOTAL OMSET</th>
                    <th>
                      Rp {totalRevenue.toLocaleString("id-ID")}
                    </th>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
