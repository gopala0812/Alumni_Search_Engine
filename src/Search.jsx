import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/alumni";

// 🔹 normalize backend (TitleCase → camelCase)
const normalizeAlumni = (a) => ({
  id: a.ID ?? a.id,
  name: a.Name ?? a.name,
  department: a.Department ?? a.department,
  year: a.Year ?? a.year,
  email: a.Email ?? a.email,
  phone: a.Phone ?? a.phone,
  address: a.Address ?? a.address,
  job: a.Job ?? a.job,
  company: a.Company ?? a.company,
  cgpa: a.CGPA ?? a.cgpa,
});

function Search() {
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    department: "",
    year: "",
    company: "",
    location: "",
  });

  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  // 🔁 dynamic search with debounce
  useEffect(() => {
    const hasValue = Object.values(filters).some(v => v !== "");
    if (!hasValue) {
      setResults([]);
      setStatus("");
      return;
    }

    setStatus("🔄 Searching...");
    const timer = setTimeout(searchAlumni, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAlumni = async () => {
    try {
      const params = {};
      Object.keys(filters).forEach(k => {
        if (filters[k]) params[k] = filters[k];
      });

      const res = await axios.get(`${BASE_URL}/search`, { params });

      // ✅ normalize once
      const normalized = res.data.map(normalizeAlumni);

      setResults(normalized);
      setStatus(
        normalized.length > 0
          ? `Found ${normalized.length} result(s).`
          : "No results found."
      );
    } catch (err) {
      console.error(err);
      setResults([]);
      setStatus("No results found.");
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleContact = (email, name) => {
    const subject = encodeURIComponent(
      `Regarding Alumni Connect - ${name}`
    );
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  return (
    <section className="search-panel">
      <h2>Search Alumni</h2>

      <div className="form-row">
        <input name="id" type="number" placeholder="ID" onChange={handleChange} />
        <input name="name" type="text" placeholder="Name (partial allowed)" onChange={handleChange} />
        <input name="department" type="text" placeholder="Department" onChange={handleChange} />
        <input name="year" type="number" placeholder="Batch Year" onChange={handleChange} />
        <input name="company" type="text" placeholder="Company" onChange={handleChange} />
        <input name="location" type="text" placeholder="Location" onChange={handleChange} />
      </div>

      <div className="status">{status}</div>

      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Company</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.department}</td>
                <td>{a.year}</td>
                <td>{a.company}</td>
                <td>
                  <button onClick={() => setSelected(a)}>
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔳 Modal */}
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>

            <h3>{selected.name}</h3>
            <p><strong>ID:</strong> {selected.id}</p>
            <p><strong>Department:</strong> {selected.department}</p>
            <p><strong>Year:</strong> {selected.year}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>Address:</strong> {selected.address}</p>
            <p><strong>Job:</strong> {selected.job}</p>
            <p><strong>Company:</strong> {selected.company}</p>
            <p><strong>CGPA:</strong> {selected.cgpa}</p>

            {selected.email && (
              <button
                className="contact-btn"
                onClick={() => handleContact(selected.email, selected.name)}
              >
                Contact Alumni
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Search;
