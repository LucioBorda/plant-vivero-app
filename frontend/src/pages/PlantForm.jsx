import { useState, useEffect } from "react";
import { getAllCategories } from "../api/categoriesApi";
import { createPlant } from "../api/plantsApi";
import "../styles/Form.css";
import ImageUploaderModal from "../components/ImageUploaderModal";

function PlantForm() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryIds: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const data = await getAllCategories();
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryToggle = (catId, e) => {
    // Prevenir la propagación del evento para evitar conflictos
    if (e) {
      e.stopPropagation();
    }
    
    const id = Number(catId);
    setFormData(prev => {
      if (prev.categoryIds.includes(id)) {
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter(x => x !== id)
        };
      } else {
        return {
          ...prev,
          categoryIds: [...prev.categoryIds, id]
        };
      }
    });
  };

  const removeCategory = (catId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.filter(x => x !== catId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.price) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    if (formData.categoryIds.length === 0) {
      alert("Debes seleccionar al menos una categoría");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      // Enviar cada categoría individualmente
      formData.categoryIds.forEach(id => data.append("categoryIds[]", id));

      await createPlant(data);

      setFormData({
        name: "",
        price: "",
        stock: "",
        description: "",
        categoryIds: []
      });
      setImageFile(null);
      alert("Planta creada con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al crear la planta");
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ color: "#9CA1D7" }}>Agregar Planta</h2>
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
          min="0.01"
          step="0.01"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          step="1"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Sección de categorías mejorada */}
        <div className="categories-container">
          <h3>Selecciona las categorías</h3>
          
          <div className="categories">
            {categories.length > 0 ? (
              categories.map((cat) => {
                const selected = formData.categoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={selected ? "selected" : ""}
                  >
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={selected}
                      onChange={(e) => handleCategoryToggle(cat.id, e)}
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })
            ) : (
              <div className="no-categories-selected">
                Cargando categorías...
              </div>
            )}
          </div>

          {/* Mostrar categorías seleccionadas */}
          {formData.categoryIds.length > 0 && (
            <div className="selected-categories">
              <h4>Categorías seleccionadas ({formData.categoryIds.length})</h4>
              <div className="selected-tags">
                {formData.categoryIds.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return category ? (
                    <span key={catId} className="category-tag">
                      {category.name}
                      <button
                        type="button"
                        onClick={() => removeCategory(catId)}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="form-buttons">
          <button
            type="button"
            className="btn"
            onClick={() => setShowModal(true)}
          >
            {imageFile ? "Cambiar Imagen" : "Agregar Imagen"}
          </button>

          <button 
            type="submit" 
            className="btn"
            disabled={formData.categoryIds.length === 0}
            style={{
              opacity: formData.categoryIds.length === 0 ? 0.6 : 1,
              cursor: formData.categoryIds.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Agregar Planta
          </button>
        </div>

        {/* Previsualización de la imagen */}
        {imageFile && (
          <div className="image-preview">
            <img src={URL.createObjectURL(imageFile)} alt="preview" />
          </div>
        )}
      </form>

      {/* Modal de subida/recorte */}
      {showModal && (
        <ImageUploaderModal
          onClose={() => setShowModal(false)}
          onImageChange={(file) => setImageFile(file)}
        />
      )}
    </div>
  );
}

export default PlantForm;