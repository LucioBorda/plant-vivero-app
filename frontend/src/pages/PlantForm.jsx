// src/pages/PlantForm.jsx
import { useState, useEffect } from "react";
import { getAllCategories } from "../api/categoriesApi";
import { createPlant } from "../api/plantsApi";
import "../styles/Form.css";

function PlantForm() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryIds: []
  });

  useEffect(() => {
    async function fetchCategories() {
      const data = await getAllCategories();
      setCategories(data || []); // Siempre aseguramos que sea array
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, categoryIds: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPlant(formData);
      setFormData({
        name: "",
        price: "",
        stock: "",
        description: "",
        categoryIds: []
      });
      alert("Planta creada con éxito!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar Planta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
        />
        <select
          multiple
          value={formData.categoryIds}
          onChange={handleCategoryChange}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Agregar Planta</button>
      </form>
    </div>
  );
}

export default PlantForm;
