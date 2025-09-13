require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

// Importar modelos
const Plant = require("./models/Plant");
const Category = require("./models/Category");

// Definir relaciones muchos a muchos
Plant.belongsToMany(Category, { through: "PlantCategories" });
Category.belongsToMany(Plant, { through: "PlantCategories" });

// Importar rutas
const plantRoutes = require("./routes/plants");
const categoryRoutes = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 5000;

// *** CORS ACTUALIZADO ***
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://20.206.162.62:3000",
    "http://20.206.162.62",
    "http://lasplantadelorenzo.brazilsouth.cloudapp.azure.com"
  ], 
  credentials: true
}));

// Middleware para JSON
app.use(express.json());

// Rutas - Agregar /api/ como prefijo
app.use("/api/plants", plantRoutes);
app.use("/api/categories", categoryRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Conexión a la base de datos y sincronización de modelos
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    await sequelize.sync({ alter: true }); // crea/actualiza tablas
    console.log("📦 Modelos sincronizados correctamente");

    // Levantar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
})();