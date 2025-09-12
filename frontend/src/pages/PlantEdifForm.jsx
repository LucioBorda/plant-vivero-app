import { useState, useEffect } from "react";
import { getAllCategories } from "../api/categoriesApi";
import { getPlantById, updatePlant } from "../api/plantsApi";
import "../styles/Form.css";
import { 
  successAlert, 
  errorAlert, 
  warningAlert, 
  loadingAlert, 
  closeAlert 
} from '../utils/sweetAlertConfig';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingData(true);
        
        // Cargar categorías y planta en paralelo
        const [categoriesData, plantData] = await Promise.all([
          getAllCategories(),
          getPlantById(plantId)
        ]);

        setCategories(categoriesData || []);
        setFormData({
          name: plantData.name,
          price: plantData.price,
          stock: plantData.stock,
          description: plantData.description,
          categoryIds: plantData.Categories?.map(c => c.id) || [],
          image: plantData.image || "https://via.placeholder.com/150"
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        errorAlert(
          'Error al cargar datos',
          'No se pudieron cargar los datos de la planta'
        );
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, [plantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    );
    setFormData({ ...formData, categoryIds: selected });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (Number(formData.price) <= 0) {
      errorAlert(
        'Error en el precio',
        'El precio debe ser mayor a 0'
      );
      return;
    }

    if (formData.categoryIds.length === 0) {
      warningAlert(
        'Categorías requeridas',
        'Debes seleccionar al menos una categoría'
      );
      return;
    }

    setIsLoading(true);
    loadingAlert('Actualizando planta...', 'Por favor espera un momento');

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);
      data.append("categoryIds", JSON.stringify(formData.categoryIds));

      await updatePlant(plantId, data);
      
      closeAlert();
      successAlert(
        '¡Planta actualizada!',
        'Los cambios se han guardado correctamente'
      );
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

  if (isLoadingData) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando datos de la planta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 style={{ color: "#9CA1D7" }}>Editar Planta</h2>
      
      {/* Preview de imagen actual */}
      <div className="image-preview" style={{ marginBottom: "20px" }}>
        <img 
          src={imageFile ? URL.createObjectURL(imageFile) : formData.image} 
          alt="preview" 
          style={{ 
            width: "150px", 
            height: "150px", 
            objectFit: "cover", 
            borderRadius: "8px",
            border: "1px solid #ddd"
          }} 
        />
      </div>

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
        <input 
          type="number" 
          name="price" 
          placeholder="Precio"
          value={formData.price} 
          onChange={handleChange} 
          min="0.01"
          step="0.01"
          required 
          disabled={isLoading}
        />
        <input 
          type="number" 
          name="stock" 
          placeholder="Stock"
          value={formData.stock} 
          onChange={handleChange} 
          min="0"
          step="1"
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
        
        <label htmlFor="categories" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Categorías:
        </label>
        <select 
          id="categories"
          multiple 
          value={formData.categoryIds} 
          onChange={handleCategoryChange}
          style={{ 
            minHeight: "120px", 
            marginBottom: "15px",
            padding: "10px"
          }}
          disabled={isLoading}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        
        <input 
          type="file" 
          onChange={handleImageChange} 
          accept="image/*"
          disabled={isLoading}
          style={{ marginBottom: "15px" }}
        />
        
        <button 
          type="submit"
          className="btn"
          disabled={isLoading || formData.categoryIds.length === 0}
          style={{
            opacity: (isLoading || formData.categoryIds.length === 0) ? 0.6 : 1,
            cursor: (isLoading || formData.categoryIds.length === 0) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Planta'}
        </button>
      </form>
    </div>
  );
}

export default PlantEditForm;