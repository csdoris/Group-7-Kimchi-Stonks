const express = require('express');

const DashboardController = require('../controllers/dashboard');

const router = express.Router();

router.get('/stock-overview/:id', DashboardController.getStockOverview);

router.get('/time-series/intraday/:id', DashboardController.getTimeSeriesIntraday);

router.get('/time-series/daily/:id', DashboardController.getTimeSeriesDaily);

router.get('/time-series/weekly/:id', DashboardController.getTimeSeriesWeekly);

router.get('/time-series/monthly/:id', DashboardController.getTimeSeriesMonthly);

router.get('/trending-stocks', DashboardController.getTrending);

router.get('/predict-price/:id', DashboardController.predictPrice);

module.exports = router;
