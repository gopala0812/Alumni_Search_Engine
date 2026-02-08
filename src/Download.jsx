import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const BASE_URL = "http://localhost:8080/alumni";

function Download() {
  const [id, setId] = useState("");
  const [batch, setBatch] = useState("");
  const [status, setStatus] = useState("");

  /* =========================
     PDF GENERATOR
  ========================= */
  const generatePDF = (records, filename) => {
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("RAJALAKSHMI INSTITUTE OF TECHNOLOGY", 105, y, { align: "center" });

    y += 8;
    doc.setFontSize(12);
    doc.text("KUTHAMBAKKAM, CHENNAI – 124", 105, y, { align: "center" });

    y += 12;
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 10;

    records.forEach((a, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text(`Alumni ${index + 1}`, 10, y);
      y += 6;

      doc.setFont("times", "normal");
      doc.setFontSize(11);

      const fields = [
        ["ID", a.ID ?? a.id],
        ["Name", a.Name ?? a.name],
        ["Department", a.Department ?? a.department],
        ["Year", a.Year ?? a.year],
        ["Email", a.Email ?? a.email],
        ["Phone", a.Phone ?? a.phone],
        ["Address", a.Address ?? a.address],
        ["Job", a.Job ?? a.job],
        ["Company", a.Company ?? a.company],
        ["CGPA", a.CGPA ?? a.cgpa],
      ];

      fields.forEach(([label, value]) => {
        doc.text(`${label}:`, 14, y);
        doc.text(String(value ?? "—"), 60, y);
        y += 6;
      });

      y += 6;
      doc.line(10, y, 200, y);
      y += 10;
    });

    doc.save(filename);
  };

  /* =========================
     DOWNLOAD BY ID
  ========================= */
  const downloadByIdPDF = async () => {
    if (!id) {
      alert("Enter Alumni ID");
      return;
    }

    try {
      setStatus("Generating PDF...");
      const res = await axios.get(`${BASE_URL}/download`, {
        params: { id },
      });

      const record = Array.isArray(res.data) ? res.data : [res.data];
      generatePDF(record, `alumni_${id}.pdf`);
      setStatus("✅ PDF downloaded");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to generate PDF");
    }
  };

  /* =========================
     DOWNLOAD BY BATCH
  ========================= */
  const downloadByBatchPDF = async () => {
    if (!batch) {
      alert("Enter Batch Year");
      return;
    }

    try {
      setStatus("Generating PDF...");
      const res = await axios.get(`${BASE_URL}/download`, {
        params: { batch },
      });

      if (!res.data || res.data.length === 0) {
        setStatus("No alumni found for this batch");
        return;
      }

      generatePDF(res.data, `alumni_batch_${batch}.pdf`);
      setStatus("✅ PDF downloaded");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to generate PDF");
    }
  };

  return (
    <section className="search-panel">
      <h2>Download Alumni (PDF)</h2>

      {/* ---- By ID ---- */}
      <h3>📄 Download Single Alumni</h3>
      <input
        type="number"
        placeholder="Enter Alumni ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <br />
      <button style={{ marginTop: 10 }} onClick={downloadByIdPDF}>
        Download PDF
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* ---- By Batch ---- */}
      <h3>📄 Download Batch-wise Alumni</h3>
      <input
        type="number"
        placeholder="Enter Batch Year"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
      />
      <br />
      <button style={{ marginTop: 10 }} onClick={downloadByBatchPDF}>
        Download Batch PDF
      </button>

      <div className="status">{status}</div>
    </section>
  );
}

export default Download;
