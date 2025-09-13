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

// *** CORS CONFIGURADO PARA AZURE ***
app.use(cors({
  origin: [
    "http://lasplantadelorenzo.brazilsouth.cloudapp.azure.com",
    "https://lasplantadelorenzo.brazilsouth.cloudapp.azure.com",
    "http://lasplantadelorenzo.brazilsouth.cloudapp.azure.com:80",
    "http://20.206.162.62",
    "http://20.206.162.62:80",
    // Permitir también cualquier origen para desarrollo
    "*"
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Para producción, permitir cualquier origen (más flexible)
app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware para JSON
app.use(express.json());

// Middleware para logs de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Headers adicionales para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rutas - Agregar /api/ como prefijo
app.use("/api/plants", plantRoutes);
app.use("/api/categories", categoryRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🌱 Vivero API funcionando - Accesible desde Azure 🚀");
});

// Ruta de salud para verificar conectividad
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    server: 'Azure Cloud App'
  });
});

// Conexión a la base de datos y sincronización de modelos
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos PostgreSQL");
    
    await sequelize.sync({ alter: true });
    console.log("📦 Modelos sincronizados correctamente");
    
    // Levantar servidor en todas las interfaces
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Accesible desde: http://lasplantadelorenzo.brazilsouth.cloudapp.azure.com:${PORT}`);
      console.log(`🌐 Frontend disponible en: http://lasplantadelorenzo.brazilsouth.cloudapp.azure.com`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
})();