// src/pages/PlantDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlantById, updatePlant } from "../api/plantsApi";
import "../styles/Form.css";
import ImageUploaderModal from "../components/ImageUploaderModal";

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
  const [showModal, setShowModal] = useState(false);

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

    // Validación: precio > 0
    if (name === "price" && Number(value) < 0) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <h2 style={{ color: "#9CA1D7", textAlign: "center", marginBottom: "20px" }}>
        Editar Planta: {plant.name}
      </h2>

      {/* Imagen actual */}
      <div className="image-preview">
        <img
          src={imageFile ? URL.createObjectURL(imageFile) : plant.image || "https://via.placeholder.com/150"}
          alt={plant.name}
          style={{ maxWidth: "250px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
      </div>

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
          min="0"
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
        />

        {/* Botón para abrir modal de imagen */}
        <div style={{ margin: "15px 0" }}>
          <button type="button" className="btn" onClick={() => setShowModal(true)}>
            {imageFile ? "Cambiar Imagen" : "Agregar Imagen"}
          </button>
        </div>

        <button type="submit" className="btn">
          Guardar Cambios
        </button>
      </form>

      {/* Modal para subir/recortar imagen */}
      {showModal && (
        <ImageUploaderModal
          onClose={() => setShowModal(false)}
          onImageChange={(file) => setImageFile(file)}
        />
      )}
    </div>
  );
};

export default PlantDetail;
