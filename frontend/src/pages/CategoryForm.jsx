// src/pages/CategoryForm.jsx
import { useState, useEffect } from "react"; // ← Agregar useEffect
import { createCategory, getAllCategories } from "../api/categoriesApi";
import "../styles/Form.css";

function CategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [categories, setCategories] = useState([]);

  // Cargar categorías existentes cuando el componente se monta
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // ← Array vacío para que solo se ejecute una vez

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await createCategory(formData);
      setCategories([...categories, newCategory]); // Agregar la nueva a la lista
      setFormData({ name: "", description: "" }); // Limpiar el formulario
      alert("Categoría creada correctamente!"); // Feedback al usuario
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error al crear la categoría");
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
          required
        />
        <button type="submit">Agregar</button>
      </form>

      <h3>Categorías existentes ({categories.length})</h3>
      {categories.length === 0 ? (
        <p>No hay categorías creadas aún.</p>
      ) : (
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              <strong>{cat.name}</strong>
              {cat.description && <span> - {cat.description}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryForm;