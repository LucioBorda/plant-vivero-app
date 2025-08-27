import { useState, useEffect } from "react";
import { getAllCategories } from "../api/categoriesApi";
import { getPlantById, updatePlant } from "../api/plantsApi";
import "../styles/Form.css";

function PlantEditForm({ plantId }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryIds: [],
    image: "" // default
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      const data = await getAllCategories();
      setCategories(data || []);
    }

    async function fetchPlant() {
      const plant = await getPlantById(plantId);
      setFormData({
        name: plant.name,
        price: plant.price,
        stock: plant.stock,
        description: plant.description,
        categoryIds: plant.Categories?.map(c => c.id) || [],
        image: plant.image || "https://via.placeholder.com/150" // imagen por defecto
      });
    }

    fetchCategories();
    fetchPlant();
  }, [plantId]);

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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);
      data.append("categoryIds", JSON.stringify(formData.categoryIds));

      await updatePlant(plantId, data);
      alert("Planta actualizada con éxito!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Planta</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
        <textarea name="description" value={formData.description} onChange={handleChange} />
        <select multiple value={formData.categoryIds} onChange={handleCategoryChange}>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input type="file" onChange={handleImageChange} />
        <img src={formData.image} alt="preview" style={{ width: 100, margin: "10px 0" }} />
        <button type="submit">Actualizar Planta</button>
      </form>
    </div>
  );
}

export default PlantEditForm;
