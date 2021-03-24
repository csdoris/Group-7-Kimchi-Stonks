const express = require('express');
const dotenv = require('dotenv');
const db = require('./mongodb/db');
const authRoutes = require('./routes/auth');

// Load all environment variables from .env
dotenv.config();

// Connect to MongoDB cluster
db.connect();

// Setup Express
const app = express();

// Setup JSON parsing for the request body
app.use(express.json());

// Expose routes to the server
app.use('/auth', authRoutes);

module.exports = app;
