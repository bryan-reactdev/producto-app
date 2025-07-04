// backend/scripts/setupDatabase.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mysql',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 3306,
};

// Database name from environment variables
const dbName = process.env.DB_NAME || 'producto-db';

async function setupDatabase() {
  let connection;
  
  try {
    // First connect without specifying database
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);
    
    // Create database if it doesn't exist
    console.log(`Creating database ${dbName} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    
    // Use the database
    console.log(`Using database ${dbName}...`);
    await connection.query(`USE \`${dbName}\``);
    
    // Create products table if it doesn't exist
    console.log('Creating products table if it\'s not exist...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        barcode VARCHAR(100) UNIQUE NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the setup function
setupDatabase(); 