// src/pages/CategoryForm.jsx
import { useState, useEffect } from "react";
import { createCategory, getAllCategories } from "../api/categoriesApi";
import "../styles/Form.css";

function CategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [categories, setCategories] = useState([]);

  // Cargar categorías existentes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await createCategory(formData);
      setCategories([...categories, newCategory]);
      setFormData({ name: "", description: "" });
      alert("Categoría creada correctamente!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error al crear la categoría");
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ color: "#9CA1D7" }}>Agregar Categoría</h2>
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
        <button type="submit" className="btn">Agregar Categoría</button>
      </form>

      <h3 style={{ marginTop: "30px", textAlign: "center" }}>
        Categorías existentes ({categories.length})
      </h3>

      <div className="existing-categories">
        {categories.length === 0 ? (
          <p style={{ textAlign: "center" }}>No hay categorías creadas aún.</p>
        ) : (
          <div className="categories-list">
            {categories.map((cat) => (
              <div key={cat.id} className="category-box">
                <strong>{cat.name}</strong>
                {cat.description && <p>{cat.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryForm;
