const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./mongodb/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

// Load all environment variables from .env
dotenv.config();

// Connect to MongoDB cluster
db.connect();

// Setup Express
const app = express();

// To resolve any Cross Origin Resource Sharing issues
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  }),
);

// Setup JSON parsing for the request body
app.use(express.json());

// Expose routes to the server
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/user', userRoutes);

app.use('/user', userRoutes);

module.exports = app;
