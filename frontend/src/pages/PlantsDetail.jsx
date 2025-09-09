import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlantById, updatePlant } from "../api/plantsApi";
import "../styles/Form.css";

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const data = await getPlantById(id);
        setPlant(data);
        setFormData({
          name: data.name,
          price: data.price,
          stock: data.stock,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching plant:", error);
      }
    };
    fetchPlant();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      await updatePlant(id, data);
      alert("Planta actualizada correctamente");
      navigate("/"); // Volver al listado
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la planta");
    }
  };

  if (!plant) return <p>Cargando...</p>;

  return (
    <div className="form-container">
      <h2>Editar Planta: {plant.name}</h2>
      <img src={plant.image || "https://via.placeholder.com/150"} alt={plant.name} width="200" />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Precio"
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
        />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default PlantDetail;
