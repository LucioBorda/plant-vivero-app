// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>🌿 My Plant App</h1>
      <nav>
        <Link to="/" className="btn">Plant List</Link>
        <Link to="/plants/new" className="btn">Add Plant</Link>
        <Link to="/categories/new" className="btn">Add Category</Link>
      </nav>
    </header>
  );
};

export default Header;
