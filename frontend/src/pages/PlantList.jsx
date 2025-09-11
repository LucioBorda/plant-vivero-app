import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlantCard from "../components/PlantCard";
import { getAllPlants, deletePlant } from "../api/plantsApi";
import { getAllCategories } from "../api/categoriesApi";
import "./PlantList.css";

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plantsData, categoriesData] = await Promise.all([
          getAllPlants(),
          getAllCategories()
        ]);
        
        setPlants(plantsData);
        setCategories(categoriesData);
        setFilteredPlants(plantsData); // Inicialmente mostrar todas
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar plantas cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(plant => 
        plant.Categories && plant.Categories.some(category => 
          category.id === parseInt(selectedCategory)
        )
      );
      setFilteredPlants(filtered);
    }
  }, [selectedCategory, plants]);

  const handleEdit = (plant) => {
    navigate(`/plants/${plant.id}`);
  };

  const handleDelete = async (plantId) => {
    try {
      await deletePlant(plantId);
      const updatedPlants = plants.filter((plant) => plant.id !== plantId);
      setPlants(updatedPlants);
      alert("Planta eliminada correctamente");
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("Error al eliminar la planta. Verifica tu conexión.");
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando plantas...</p>
      </div>
    );
  }

  return (
    <div className="plant-list-container">
      {/* Sidebar de filtros */}
      <aside className="filters-sidebar">
        <div className="filters-header">
          <h3>Categorías</h3>
        </div>
        
        <div className="filter-options">
          {/* Opción "Todas" */}
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === "all"}
              onChange={() => handleCategoryChange("all")}
            />
            <span className="filter-label">
              Todas ({plants.length})
            </span>
          </label>

          {/* Categorías dinámicas */}
          {categories.map((category) => {
            const categoryCount = plants.filter(plant => 
              plant.Categories && plant.Categories.some(cat => cat.id === category.id)
            ).length;
            
            return (
              <label key={category.id} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value={category.id.toString()}
                  checked={selectedCategory === category.id.toString()}
                  onChange={() => handleCategoryChange(category.id.toString())}
                />
                <span className="filter-label">
                  {category.name} ({categoryCount})
                </span>
              </label>
            );
          })}
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="plants-main-content">
        <div className="plants-header">
          <h2>
            {selectedCategory === "all" 
              ? `Todas las plantas (${filteredPlants.length})` 
              : `${categories.find(cat => cat.id.toString() === selectedCategory)?.name || 'Categoría'} (${filteredPlants.length})`
            }
          </h2>
        </div>

        {filteredPlants.length === 0 ? (
          <div className="no-plants">
            <p>No hay plantas en esta categoría</p>
          </div>
        ) : (
          <div className="plants-grid">
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlantList;