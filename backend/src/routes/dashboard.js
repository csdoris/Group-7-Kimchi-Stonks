const express = require('express');

const DashboardController = require('../controllers/dashboard');

const router = express.Router();

router.get('/stock-data/:id', DashboardController.getStockData);

router.get('/trending-stocks', DashboardController.getTrending);

router.get('/predict-price/:id', DashboardController.predictPrice);

module.exports = router;
