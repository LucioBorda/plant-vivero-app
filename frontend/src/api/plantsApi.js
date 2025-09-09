const API_URL = "http://localhost:5000/api/plants"; // URL completa de la API

// Crear planta (con FormData)
export const createPlant = async (plantData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    body: plantData, // FormData
  });
  return res.json();
};

// Obtener todas las plantas
export const getAllPlants = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

// Obtener planta por ID
export const getPlantById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

// Actualizar planta (con FormData)
export const updatePlant = async (id, plantData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: plantData, // FormData
  });
  if (!res.ok) throw new Error("Error updating plant");
  return res.json();
};

// Eliminar planta
export const deletePlant = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting plant");
};
