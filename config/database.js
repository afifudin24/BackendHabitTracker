// config/database.js
require('dotenv').config();  
const { Sequelize } = require('sequelize');

console.log(process.env.DB_USER)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',   // ← Sequelize akan otomatis mencari mysql2
    logging: false,
  }
);

module.exports = {
    sequelize
}