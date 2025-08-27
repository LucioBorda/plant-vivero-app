const API_URL = "/plants";

// Recibimos un FormData con la imagen
export const createPlant = async (plantData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    body: plantData, // No ponemos Content-Type, fetch lo maneja para FormData
  });
  return res.json();
};

export const getAllPlants = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getPlantById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const updatePlant = async (id, plantData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: plantData, // FormData para poder actualizar la imagen
  });
  return res.json();
};

export const deletePlant = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
