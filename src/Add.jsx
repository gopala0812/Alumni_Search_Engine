import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const BASE_URL = "http://localhost:8080/alumni";

function Add() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    department: "",
    year: "",
    email: "",
    phone: "",
    address: "",
    job: "",
    company: "",
    cgpa: ""
  });

  const [bulkData, setBulkData] = useState([]);
  const [status, setStatus] = useState("");

  /* ======================
     SINGLE ADD
  ====================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSingle = async () => {
    try {
      setStatus("Adding alumni...");
      await axios.post(`${BASE_URL}/add`, form);
      setStatus("✅ Alumni added successfully");

      setForm({
        id: "",
        name: "",
        department: "",
        year: "",
        email: "",
        phone: "",
        address: "",
        job: "",
        company: "",
        cgpa: ""
      });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to add alumni");
    }
  };

  /* ======================
     BULK ADD (EXCEL)
  ====================== */
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(worksheet);
      setBulkData(json);
      setStatus(`📄 Loaded ${json.length} alumni from Excel`);
    };
    reader.readAsArrayBuffer(file);
  };

  const submitBulk = async () => {
    if (bulkData.length === 0) {
      alert("Please upload an Excel file first");
      return;
    }

    try {
      setStatus("Uploading alumni in bulk...");
      await axios.post(`${BASE_URL}/add-bulk`, bulkData);
      setStatus("✅ Bulk alumni added successfully");
      setBulkData([]);
    } catch (err) {
      console.error(err);
      setStatus("❌ Bulk upload failed");
    }
  };

  return (
    <section className="search-panel">
      <h2>Add Alumni</h2>

      {/* -------- SINGLE ADD -------- */}
      <h3>➕ Add Single Alumni</h3>
      <div className="form-row">
        <input name="id" placeholder="ID" value={form.id} onChange={handleChange} />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input name="year" placeholder="Batch Year" value={form.year} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="job" placeholder="Job" value={form.job} onChange={handleChange} />
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
        <input name="cgpa" placeholder="CGPA" value={form.cgpa} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      </div>

      <button style={{ marginTop: 10 }} onClick={submitSingle}>
        Add Alumni
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* -------- BULK ADD -------- */}
      <h3>📥 Add Bulk Alumni (Excel)</h3>
      <p style={{ fontSize: 14, opacity: 0.8 }}>
        Upload an Excel file (.xlsx). Column names should match alumni fields.
      </p>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelUpload}
      />

      {bulkData.length > 0 && (
        <p style={{ marginTop: 10 }}>
          ✅ {bulkData.length} records ready to upload
        </p>
      )}

      <button style={{ marginTop: 10 }} onClick={submitBulk}>
        Upload Excel
      </button>

      <div className="status">{status}</div>
    </section>
  );
}

export default Add;
