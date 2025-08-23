// Importamos las dependencias necesarias
const express = require('express');   // Framework para el servidor
const cors = require('cors');         // Permite peticiones desde el frontend
require('dotenv').config();           // Carga las variables de entorno

// Creamos la app
const app = express();
const plantRoutes = require("./routes/plantsRoute");
// Middleware (cosas que se ejecutan antes de llegar a las rutas)
app.use(cors());            // Permite que el frontend (React) acceda
app.use(express.json());    // Para que el servidor entienda JSON

// Montamos rutas
app.use("/plants", plantRoutes);

// Puerto (viene de variables de entorno, con fallback 3000)
const PORT = process.env.PORT || 5000;

// Ruta inicial (ejemplo de prueba)
app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

// Levantamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
