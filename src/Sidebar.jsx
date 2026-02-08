import { NavLink } from "react-router-dom";

function Sidebar({ open, onClose }) {
  const isMobile = window.innerWidth <= 900;

  return (
    <>
      {open && isMobile && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>

        {/* Logo Section */}
        <div className="sidebar-logo">
          <img src="/rit-logo.png" alt="RIT Logo" />
        </div>

        <div className="sidebar-header">RIT</div>

        <nav className="sidebar-nav">
          <NavLink to="/search" className="nav-link" onClick={onClose}>
            🔍 Search
          </NavLink>
          <NavLink to="/add" className="nav-link" onClick={onClose}>
            ➕ Add
          </NavLink>
          <NavLink to="/download" className="nav-link" onClick={onClose}>
            ⬇️ Download
          </NavLink>

          {/* ✅ Announcement added */}
          <NavLink to="/announcement" className="nav-link" onClick={onClose}>
            📢 Announcement
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
