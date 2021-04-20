const express = require('express');

const validateUser = require('../middleware/validateUser');
const DashboardController = require('../controllers/dashboard');

const router = express.Router();

router.get('/stock-overview/:id', validateUser, DashboardController.getStockOverview);

router.get('/time-series/intraday/:id', validateUser, DashboardController.getTimeSeriesIntraday);

router.get('/time-series/daily/:id', validateUser, DashboardController.getTimeSeriesDaily);

router.get('/time-series/weekly/:id', validateUser, DashboardController.getTimeSeriesWeekly);

router.get('/time-series/monthly/:id', validateUser, DashboardController.getTimeSeriesMonthly);

router.get('/trending-stocks', validateUser, DashboardController.getTrending);

router.get('/predict-price/:id', validateUser, DashboardController.predictPrice);

module.exports = router;
