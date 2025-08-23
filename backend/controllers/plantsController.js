const plants = require("../models/plant");

// GET /plants
exports.getPlants = (req, res) => {
  res.json(plants);
};

// POST /plants
exports.addPlant = (req, res) => {
  const { name, stock, price } = req.body;
  const newPlant = { id: Date.now(), name, stock, price };
  plants.push(newPlant);
  res.status(201).json(newPlant);
};
