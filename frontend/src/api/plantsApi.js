const API_URL = "/plants";

export const getAllPlants = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getPlantById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const createPlant = async (plant) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  return res.json();
};

export const updatePlant = async (id, plant) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  return res.json();
};

export const deletePlant = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
