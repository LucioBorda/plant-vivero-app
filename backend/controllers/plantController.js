const Plant = require("../models/Plant");
const Category = require("../models/Category");

module.exports = {
  // Crear planta
  createPlant: async (req, res) => {
    try {
      const { name, price, stock, description, categoryIds } = req.body;

      // Crear la planta
      const plant = await Plant.create({ name, price, stock, description });

      // Asociar categorías si se envían
      if (categoryIds && categoryIds.length > 0) {
        const categories = await Category.findAll({
          where: { id: categoryIds },
        });
        await plant.addCategories(categories);
      }

      // Devolver planta creada con categorías
      const plantWithCategories = await Plant.findByPk(plant.id, {
        include: Category,
      });

      res.status(201).json(plantWithCategories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener todas las plantas
  getAllPlants: async (req, res) => {
    try {
      const plants = await Plant.findAll({ include: Category });
      res.json(plants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar planta
  updatePlant: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, stock, description, categoryIds } = req.body;

      const plant = await Plant.findByPk(id);
      if (!plant) return res.status(404).json({ error: "Planta no encontrada" });

      // Actualizar campos
      await plant.update({ name, price, stock, description });

      // Actualizar categorías
      if (categoryIds) {
        const categories = await Category.findAll({ where: { id: categoryIds } });
        await plant.setCategories(categories);
      }

      const updatedPlant = await Plant.findByPk(id, { include: Category });
      res.json(updatedPlant);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar planta
  deletePlant: async (req, res) => {
    try {
      const { id } = req.params;
      const plant = await Plant.findByPk(id);
      if (!plant) return res.status(404).json({ error: "Planta no encontrada" });

      await plant.destroy();
      res.json({ message: "Planta eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

    // GET /plants/:id
  getPlantById: async (req, res) => {
    try {
      const { id } = req.params;
      const plant = await Plant.findByPk(id, {
        include: {
          model: Category,
          attributes: ["id", "name"]
        }
      });

      if (!plant) return res.status(404).json({ message: "Planta no encontrada" });

      res.json(plant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

