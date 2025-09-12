import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlantCard from "../components/PlantCard";
import { getAllPlants, deletePlant } from "../api/plantsApi";
import { getAllCategories } from "../api/categoriesApi";
import {
  confirmAlert,
  successAlert,
  errorAlert,
  loadingAlert,
  closeAlert,
} from "../utils/sweetAlertConfig"; // importamos las alertas
import "./PlantList.css";

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plantsData, categoriesData] = await Promise.all([
          getAllPlants(),
          getAllCategories(),
        ]);

        setPlants(plantsData);
        setCategories(categoriesData);
        setFilteredPlants(plantsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar plantas por categoría y búsqueda
  useEffect(() => {
    let filtered = plants;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (plant) =>
          plant.Categories &&
          plant.Categories.some(
            (category) => category.id === parseInt(selectedCategory)
          )
      );
    }

    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((plant) => {
        const matchesName = plant.name
          ?.toLowerCase()
          .includes(searchTermLower);

        const matchesDescription = plant.description
          ?.toLowerCase()
          .includes(searchTermLower);

        const matchesCategory = plant.Categories?.some((category) =>
          category.name?.toLowerCase().includes(searchTermLower)
        );

        const matchesPrice = plant.price
          ?.toString()
          .includes(searchTerm);

        return (
          matchesName ||
          matchesDescription ||
          matchesCategory ||
          matchesPrice
        );
      });
    }

    setFilteredPlants(filtered);
  }, [selectedCategory, plants, searchTerm]);

  const handleEdit = (plant) => {
    navigate(`/plants/${plant.id}`);
  };

  const handleDelete = async (plantId, plantName) => {
    try {
      const result = await confirmAlert(
        "¿Estás seguro?",
        `¿Deseas eliminar "${plantName}"?`
      );

      if (result.isConfirmed) {
        loadingAlert("Eliminando planta...");
        await deletePlant(plantId);

        const updatedPlants = plants.filter((plant) => plant.id !== plantId);
        setPlants(updatedPlants);

        closeAlert();
        successAlert("Planta eliminada", `"${plantName}" se eliminó correctamente`);
      }
    } catch (error) {
      console.error("Error deleting plant:", error);
      closeAlert();
      errorAlert("Error", "No se pudo eliminar la planta. Verifica tu conexión.");
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
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
          <h3>Filtros</h3>
          {(searchTerm || selectedCategory !== "all") && (
            <button onClick={clearAllFilters} className="clear-all-btn">
              Limpiar todo
            </button>
          )}
        </div>

        {/* Buscador */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar plantas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search-btn">
                ×
              </button>
            )}
            <div className="search-icon">🔍</div>
          </div>
          {searchTerm && (
            <p className="search-info">
              Buscando: "<span className="search-term">{searchTerm}</span>"
            </p>
          )}
        </div>

        {/* Categorías */}
        <div className="filter-options">
          <h4>Categorías</h4>
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === "all"}
              onChange={() => handleCategoryChange("all")}
            />
            <span className="filter-label">Todas ({plants.length})</span>
          </label>

          {categories.map((category) => {
            let categoryCount;
            if (searchTerm.trim() === "") {
              categoryCount = plants.filter(
                (plant) =>
                  plant.Categories &&
                  plant.Categories.some((cat) => cat.id === category.id)
              ).length;
            } else {
              const searchTermLower = searchTerm.toLowerCase().trim();
              categoryCount = plants.filter((plant) => {
                const hasCategory =
                  plant.Categories &&
                  plant.Categories.some((cat) => cat.id === category.id);
                const matchesSearch =
                  plant.name?.toLowerCase().includes(searchTermLower) ||
                  plant.description
                    ?.toLowerCase()
                    .includes(searchTermLower) ||
                  plant.Categories?.some((cat) =>
                    cat.name?.toLowerCase().includes(searchTermLower)
                  ) ||
                  plant.price?.toString().includes(searchTerm);
                return hasCategory && matchesSearch;
              }).length;
            }

            return (
              <label key={category.id} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value={category.id.toString()}
                  checked={selectedCategory === category.id.toString()}
                  onChange={() =>
                    handleCategoryChange(category.id.toString())
                  }
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
            {searchTerm && selectedCategory === "all"
              ? `Resultados de búsqueda (${filteredPlants.length})`
              : searchTerm && selectedCategory !== "all"
              ? `Búsqueda en ${
                  categories.find(
                    (cat) => cat.id.toString() === selectedCategory
                  )?.name
                } (${filteredPlants.length})`
              : selectedCategory === "all"
              ? `Todas las plantas (${filteredPlants.length})`
              : `${
                  categories.find(
                    (cat) => cat.id.toString() === selectedCategory
                  )?.name || "Categoría"
                } (${filteredPlants.length})`}
          </h2>

          <div className="active-filters-display">
            {selectedCategory !== "all" && (
              <span className="active-filter-tag">
                📁{" "}
                {
                  categories.find(
                    (cat) => cat.id.toString() === selectedCategory
                  )?.name
                }
                <button onClick={() => setSelectedCategory("all")}>×</button>
              </span>
            )}
            {searchTerm && (
              <span className="active-filter-tag">
                🔍 "{searchTerm}"
                <button onClick={clearSearch}>×</button>
              </span>
            )}
          </div>
        </div>

        {filteredPlants.length === 0 ? (
          <div className="no-plants">
            {searchTerm ? (
              <>
                <p>No se encontraron plantas que coincidan con tu búsqueda</p>
                <p className="search-suggestions">
                  Intenta buscar por:
                  <br />• Nombre de la planta
                  <br />• Categoría
                  <br />• Descripción
                  <br />• Precio
                </p>
                <button
                  onClick={clearAllFilters}
                  className="reset-search-btn"
                >
                  Ver todas las plantas
                </button>
              </>
            ) : (
              <p>No hay plantas en esta categoría</p>
            )}
          </div>
        ) : (
          <div className="plants-grid">
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onEdit={handleEdit}
                onDelete={() => handleDelete(plant.id, plant.name)} // 👈 ahora pasa id y nombre
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlantList;
