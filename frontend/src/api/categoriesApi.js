const API_URL = "http://localhost:5000/api/categories";

export const getAllCategories = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createCategory = async (category) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  return res.json();
};