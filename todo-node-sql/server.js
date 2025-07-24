// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todo');
require('./db/connection'); // Initialize DB connection and tables

// Load environment variables from .env
dotenv.config();

const app = express();
const corsOptions = {
    origin: '*', // Replace with your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type'], // Allowed headers
  };
  
  app.use(cors(corsOptions));
// Middleware
app.use(bodyParser.json());

// Routes: Directly use routes without a prefix
app.use(todoRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
