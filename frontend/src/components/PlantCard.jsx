import React, { useState } from "react";
import "./PlantCard.css"; // Estilos específicos para la card

const PlantCard = ({ plant }) => {
  const [imageError, setImageError] = useState(false);
  
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

  return (
    <div className="plant-card">
      <img 
        src={getImageSrc()} 
        alt={plant.name} 
        className="plant-image"
        onError={handleImageError}
      />
      <h3 className="plant-name">{plant.name}</h3>
      {plant.price && <p className="plant-price">${plant.price}</p>}
    </div>
  );
};

export default PlantCard;