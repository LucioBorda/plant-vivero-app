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

// *** CORS SIMPLIFICADO - Nginx maneja el proxy ***
app.use(cors({
  origin: true, // Permite cualquier origen porque Nginx hace el proxy
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware para JSON
app.use(express.json());

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use("/api/plants", plantRoutes);
app.use("/api/categories", categoryRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🌱 Vivero API funcionando con Nginx Proxy 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    proxy: "Nginx",
    server: "Azure + Docker"
  });
});

// Conexión a DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");
    
    await sequelize.sync({ alter: true });
    console.log("📦 Modelos sincronizados");
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend corriendo en puerto ${PORT}`);
      console.log(`🔄 Proxy reverso: Nginx maneja las requests`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();