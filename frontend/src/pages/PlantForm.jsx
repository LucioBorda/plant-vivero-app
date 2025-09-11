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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (Number(formData.price) <= 0) {
    alert("El precio debe ser mayor a 0");
    return;
  }

  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    if (imageFile) data.append("image", imageFile);
    data.append("categoryIds", JSON.stringify(formData.categoryIds));

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
  min="0.01" // evita valores negativos o cero
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

        {/* Categorías centradas */}
        <div className="categories-container">
          <div className="categories">
            {categories.map((cat) => {
              const selected = formData.categoryIds[0] === cat.id;
              return (
                <label
                  key={cat.id}
                  className={selected ? "selected" : ""}
                  onClick={() => setFormData({ ...formData, categoryIds: [cat.id] })}
                >
                  {cat.name}
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={selected}
                    readOnly
                  />
                </label>
              );
            })}
          </div>
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

          <button type="submit" className="btn">
            Agregar Planta
          </button>
        </div>

        {/* Previsualización de la imagen */}
        {imageFile && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="preview"
            />
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
