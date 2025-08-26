const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");

// Rutas de plantas
router.post("/", plantController.createPlant);
router.get("/", plantController.getAllPlants);
router.put("/:id", plantController.updatePlant);
router.delete("/:id", plantController.deletePlant);
router.get("/:id", plantController.getPlantById);

module.exports = router;
