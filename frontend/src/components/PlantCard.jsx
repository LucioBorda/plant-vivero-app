import React, { useState } from "react";
import "./PlantCard.css";

const PlantCard = ({ plant, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Imagen por defecto de Cloudinary
  const defaultImage = "https://res.cloudinary.com/dnq7qxwca/image/upload/v1756335309/brotedeafult_s4kavu.webp";
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Determinar qué imagen mostrar
  const getImageSrc = () => {
    if (!plant.image || plant.image === "" || imageError) {
      return defaultImage;
    }
    return plant.image;
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit(plant);
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${plant.name}"?`)) {
      onDelete(plant.id);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Cerrar menú si se hace click fuera
  const handleClickOutside = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  return (
    <div className="plant-card" onClick={handleClickOutside}>
      {/* Contenedor de imagen con proporción fija */}
      <div className="plant-image-container">
        {/* Botón de menú (tres puntitos) */}
        <div className="plant-card-menu">
          <button 
            className="menu-button" 
            onClick={toggleMenu}
            aria-label="Opciones"
          >
            ⋮
          </button>
          
          {/* Menú desplegable */}
          {showMenu && (
            <div className="dropdown-menu">
              <button className="menu-item" onClick={handleEdit}>
                Editar
              </button>
              <button className="menu-item delete" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          )}
        </div>

        <img 
          src={getImageSrc()} 
          alt={plant.name} 
          className="plant-image"
          onError={handleImageError}
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="plant-card-content">
        <h3 className="plant-name">{plant.name}</h3>
        {plant.price && <p className="plant-price">${plant.price}</p>}
      </div>
    </div>
  );
};

export default PlantCard;