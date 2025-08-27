// src/pages/CategoryForm.jsx
import { useState } from "react";
import { createCategory, getAllCategories } from "../api/categoriesApi";
import "../styles/Form.css";

function CategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await createCategory(formData);
      setCategories([...categories, newCategory]);
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">Agregar</button>
      </form>

      <h3>Categorías existentes</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryForm;
