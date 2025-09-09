import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../lasplantasdelorenzo.jpg"; // ← tu imagen del logo

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Las plantas de lorenzo</h1>
      </div>
      <nav>
        <Link to="/" className="btn">Plant List</Link>
        <Link to="/plants/new" className="btn">Add Plant</Link>
        <Link to="/categories/new" className="btn">Add Category</Link>
      </nav>
    </header>
  );
};

export default Header;
