const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mysql',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'producto-db',
  port: process.env.DB_PORT || 3306
};

const pool = mysql.createPool(dbConfig);

module.exports = pool; 