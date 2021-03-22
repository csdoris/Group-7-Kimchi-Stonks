const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');

// Load all environment variables from .env
dotenv.config();

// Connect to MongoDB cluster
db.connect(() => {

  // Setup Express
  const app = express();

  // Setup JSON parsing for the request body
  app.use(express.json());

  // Example route
  app.use('/', (req, res) => {
    res.json({ text: 'Hello World!' });
  });
});

module.exports = app;
