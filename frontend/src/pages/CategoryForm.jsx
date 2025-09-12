// src/pages/CategoryForm.jsx
import { useState, useEffect } from "react";
import { createCategory, getAllCategories } from "../api/categoriesApi";
import "../styles/Form.css";
import { 
  successAlert, 
  errorAlert, 
  loadingAlert, 
  closeAlert 
} from '../utils/sweetAlertConfig';

function CategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar categorías existentes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        errorAlert(
          'Error al cargar categorías',
          'No se pudieron cargar las categorías existentes'
        );
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      errorAlert(
        'Nombre requerido',
        'El nombre de la categoría es obligatorio'
      );
      return;
    }

    setIsLoading(true);
    loadingAlert('Creando categoría...', 'Por favor espera un momento');

    try {
      const newCategory = await createCategory(formData);
      setCategories([...categories, newCategory]);
      setFormData({ name: "", description: "" });
      
      closeAlert();
      successAlert(
        '¡Categoría creada!',
        `La categoría "${newCategory.name}" se ha creado correctamente`
      );
    } catch (error) {
      console.error("Error creating category:", error);
      closeAlert();
      errorAlert(
        'Error al crear la categoría',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Creando...' : 'Agregar Categoría'}
        </button>
      </form>

      <h3 style={{ marginTop: "30px", textAlign: "center" }}>
        Categorías existentes ({categories.length})
      </h3>

      <div className="existing-categories">
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
            No hay categorías creadas aún.
          </p>
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