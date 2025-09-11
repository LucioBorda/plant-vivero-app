// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Columna izquierda */}
        <div className="footer-left">
          <a
            href="https://www.instagram.com/tu_instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            📸 Seguinos en Instagram
          </a>
          <p>📍 Calle 64 279, La plata, Buenos Aires</p>
        </div>

        {/* Columna derecha */}
        <div className="footer-right">
          <p>🌱 Las plantas de lorenzo - Todos los derechos reservados © {new Date().getFullYear()}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
