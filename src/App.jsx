import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";

import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Search from "./Search";
import Add from "./Add";
import Download from "./Download";
import Announcement from "./Announcement";
import BrandingBar from "./BrandingBar";

const DESKTOP_WIDTH = 900;

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > DESKTOP_WIDTH);

  /* =====================
     THEME STATE
  ===================== */
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    setDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > DESKTOP_WIDTH) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => {
    if (window.innerWidth <= DESKTOP_WIDTH) {
      setSidebarOpen(false);
    }
  };

  return (
    <Router>
      <div className="app-container">

        <BrandingBar />
<Header onMenuClick={toggleSidebar} />


        {/* Theme toggle row (below branding strip) */}
        <div className="theme-toggle-row">
          <button className="theme-toggle" onClick={toggleTheme}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/search" />} />
            <Route path="/search" element={<Search onNavigate={closeSidebar} />} />
            <Route path="/add" element={<Add onNavigate={closeSidebar} />} />
            <Route path="/download" element={<Download onNavigate={closeSidebar} />} />
            <Route path="/announcement" element={<Announcement onNavigate={closeSidebar} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
