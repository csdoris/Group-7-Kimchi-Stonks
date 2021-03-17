const express = require('express');

const app = express();

// Example route
app.use('/', (req, res) => {
  res.json({ text: 'Hello World!' });
});

module.exports = app;
