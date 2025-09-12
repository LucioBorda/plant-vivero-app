// src/pages/PlantDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlantById, updatePlant } from "../api/plantsApi";
import "../styles/Form.css";
import ImageUploaderModal from "../components/ImageUploaderModal";
import { 
  successAlert, 
  errorAlert, 
  warningAlert, 
  confirmAlert, 
  loadingAlert, 
  closeAlert 
} from '../utils/sweetAlertConfig';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setIsLoadingData(true);
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
        errorAlert(
          'Error al cargar la planta',
          'No se pudo cargar la información de la planta'
        );
        navigate('/'); // Volver al listado si hay error
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchPlant();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación: precio > 0
    if (name === "price" && Number(value) < 0) {
      warningAlert(
        'Precio inválido',
        'El precio no puede ser negativo'
      );
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      errorAlert(
        'Nombre requerido',
        'El nombre de la planta es obligatorio'
      );
      return;
    }

    if (Number(formData.price) <= 0) {
      errorAlert(
        'Precio inválido',
        'El precio debe ser mayor a 0'
      );
      return;
    }

    if (Number(formData.stock) < 0) {
      errorAlert(
        'Stock inválido',
        'El stock no puede ser negativo'
      );
      return;
    }

    // Confirmación antes de guardar
    const result = await confirmAlert(
      '¿Guardar cambios?',
      'Se actualizarán los datos de la planta'
    );

    if (!result.isConfirmed) return;

    setIsLoading(true);
    loadingAlert('Actualizando planta...', 'Guardando los cambios...');

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      await updatePlant(id, data);
      
      closeAlert();
      const result = await successAlert(
        '¡Planta actualizada!',
        'Los cambios se han guardado correctamente'
      );

      // Opcional: regresar al listado después del éxito
      if (result.isConfirmed) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      closeAlert();
      errorAlert(
        'Error al actualizar',
        error.response?.data?.message || 'No se pudo actualizar la planta'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    const result = await confirmAlert(
      '¿Cancelar edición?',
      'Se perderán los cambios no guardados'
    );

    if (result.isConfirmed) {
      navigate("/");
    }
  };

  if (isLoadingData) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando información de la planta...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>No se pudo cargar la planta</p>
          <button className="btn" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

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
          style={{ 
            maxWidth: "250px", 
            borderRadius: "8px", 
            border: "1px solid #ddd",
            objectFit: "cover"
          }}
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
          disabled={isLoading}
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Precio"
          min="0.01"
          step="0.01"
          required
          disabled={isLoading}
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          min="0"
          step="1"
          disabled={isLoading}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
          disabled={isLoading}
        />

        {/* Botones */}
        <div className="form-buttons">
          <button 
            type="button" 
            className="btn" 
            onClick={() => setShowModal(true)}
            disabled={isLoading}
          >
            {imageFile ? "Cambiar Imagen" : "Agregar Imagen"}
          </button>

          <button 
            type="submit" 
            className="btn"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              backgroundColor: '#22c55e'
            }}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <button 
            type="button" 
            className="btn"
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              backgroundColor: '#6b7280',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
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