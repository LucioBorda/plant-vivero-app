const Category = require("../models/Category");
const Plant = require("../models/Plant");

module.exports = {
  // Crear categoría
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener todas las categorías
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: Plant, // Incluye las plantas relacionadas
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una categoría por ID
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: Plant,
      });
      if (!category) return res.status(404).json({ error: "Categoría no encontrada" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar categoría
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ error: "Categoría no encontrada" });

      await category.update({ name, description });
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar categoría
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ error: "Categoría no encontrada" });

      await category.destroy();
      res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
