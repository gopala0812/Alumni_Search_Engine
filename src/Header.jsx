import { useState, useEffect } from "react";

function Header({ onMenuClick }) {
  const [dark, setDark] = useState(false);

  // Load saved theme
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

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger" onClick={onMenuClick}>
          ☰
        </button>
        <div className="title">
          <div className="college-name">
            RAJALAKSHMI INSTITUTE OF TECHNOLOGY, CHENNAI
          </div>
          <div className="portal-name">ALUMNI PORTAL</div>
        </div>
      </div>

      {/* Toggle removed from header */}
    </header>
  );
}

export default Header;
