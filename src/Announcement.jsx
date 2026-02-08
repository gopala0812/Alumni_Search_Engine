import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/alumni";

function Announcement() {

  const [form, setForm] = useState({
    year: "",
    department: "",
    location: "",
    company: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Send announcement
  const sendAnnouncement = async () => {

    if (!form.subject || !form.message) {
      alert("Subject and Message are required");
      return;
    }

    try {
      setStatus("Sending emails...");

      const payload = {};

      Object.keys(form).forEach(k => {
        if (form[k]) payload[k] = form[k];
      });

      const res = await axios.post(
        `${BASE_URL}/send-announcement`,
        payload
      );

      setStatus(
        `✅ Success! Mails sent: ${res.data.mailsSent}`
      );

      setForm({
        year: "",
        department: "",
        location: "",
        company: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send announcement");
    }
  };

  return (
    <section className="search-panel">

      <h2>Send Announcement (Email)</h2>

      {/* Filters */}
      <h3>🎯 Target Filters (Optional)</h3>

      <div className="form-row">
        <input
          name="year"
          placeholder="Batch Year"
          value={form.year}
          onChange={handleChange}
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* Mail */}
      <h3>✉ Mail Content</h3>

      <input
        name="subject"
        placeholder="Mail Subject"
        value={form.subject}
        onChange={handleChange}
      />

      <textarea
        name="message"
        rows="8"
        placeholder="Type your announcement message here..."
        value={form.message}
        onChange={handleChange}
        style={{ marginTop: 10 }}
      />

      <br />

      <button
        style={{ marginTop: 15 }}
        onClick={sendAnnouncement}
      >
        Send Announcement
      </button>

      <div className="status">{status}</div>

    </section>
  );
}

export default Announcement;
