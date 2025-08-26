const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Plant = sequelize.define("Plant", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  description: { type: DataTypes.TEXT },
});

module.exports = Plant;
