// app.js
const express = require("express");
const sequelize = require("./db");

const app = express();
const PORT = 5000;

// Middleware para JSON
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Probar conexión con la base
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos PostgreSQL");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
})();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
