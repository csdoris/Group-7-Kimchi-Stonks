const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./mongodb/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

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

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});
// Setup JSON parsing for the request body
app.use(express.json());

// Expose routes to the server
app.use('/auth', authRoutes);

app.use('/user', userRoutes);

module.exports = app;
