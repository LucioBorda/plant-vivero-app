const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const upload = require("../middlewares/upload");

// Crear planta con imagen
router.post("/", upload.single("image"), plantController.createPlant);

// Editar planta con imagen
router.put("/:id", upload.single("image"), plantController.updatePlant);

// Rutas de plantas sin imagen
router.get("/", plantController.getAllPlants);
router.get("/:id", plantController.getPlantById);
router.delete("/:id", plantController.deletePlant);

module.exports = router;
