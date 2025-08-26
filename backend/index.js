require("dotenv").config();
const express = require("express");
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

// Middleware para JSON
app.use(express.json());

// Rutas
app.use("/plants", plantRoutes);
app.use("/categories", categoryRoutes);

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
