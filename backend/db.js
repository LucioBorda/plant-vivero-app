const { Sequelize } = require('sequelize');
require('dotenv').config(); // carga las variables de entorno del .env

// crea la conexión a la base de datos con Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,     // nombre de la BD
  process.env.DB_USERNAME, // usuario
  process.env.DB_PASSWORD, // contraseña
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false // opcional, para no llenar la consola
  }
);

module.exports = sequelize;
