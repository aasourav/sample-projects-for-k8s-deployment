// db/connection.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Create a connection to the MySQL server (without specifying a database yet)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.SPRING_DATASOURCE_USERNAME,
  password: process.env.SPRING_DATASOURCE_PASSWORD,
  port: process.env.DB_PORT
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL server:', err);
    return;
  }
  console.log('Connected to the MySQL server.');

  // Create the database if it doesn't exist
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log(`Database ${process.env.DB_NAME} created or already exists.`);

    // Switch to the new database
    connection.changeUser({ database: process.env.DB_NAME }, (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        return;
      }
      console.log(`Using database ${process.env.DB_NAME}`);

      // Create the todos table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          is_done BOOLEAN DEFAULT FALSE
        )
      `;
      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          return;
        }
        console.log('Todos table created or already exists.');
      });
    });
  });
});

module.exports = connection;
