import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← Importamos useNavigate
import PlantCard from "../components/PlantCard";
import { getAllPlants, deletePlant } from "../api/plantsApi"; 
import "./PlantList.css";

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate(); // ← Hook para navegación

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getAllPlants();
        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlants();
  }, []);

  // Función para editar planta → ahora navega a la página de detalle
  const handleEdit = (plant) => {
    navigate(`/plants/${plant.id}`);
  };

  // Función para eliminar planta
  const handleDelete = async (plantId) => {
    try {
      await deletePlant(plantId);
      setPlants(plants.filter((plant) => plant.id !== plantId));
      alert("Planta eliminada correctamente");
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("Error al eliminar la planta. Verifica tu conexión.");
    }
  };

  return (
    <div>
      <div className="plants-grid">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default PlantList;
