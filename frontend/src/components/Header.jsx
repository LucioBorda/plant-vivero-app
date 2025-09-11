import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../lasplantasdelorenzo.jpg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Las plantas de Lorenzo</h1>
      </div>

      {/* Icono hamburguesa */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </div>

      {/* Links */}
      <nav className={menuOpen ? "open" : ""}>
        <Link to="/" className="btn" onClick={() => setMenuOpen(false)}>Plant List</Link>
        <Link to="/plants/new" className="btn" onClick={() => setMenuOpen(false)}>Add Plant</Link>
        <Link to="/categories/new" className="btn" onClick={() => setMenuOpen(false)}>Add Category</Link>
      </nav>
    </header>
  );
};

export default Header;
