const express = require('express');

const validateUser = require('../middleware/validateUser');
const DashboardController = require('../controllers/dashboard');

const router = express.Router();

router.get('/search', validateUser, DashboardController.searchStocks);

router.get('/trending-stocks', validateUser, DashboardController.getTrending);

router.get('/stock-overview/:symbol', validateUser, DashboardController.getStockOverview);

router.get('/predict-price/:symbol', validateUser, DashboardController.predictPrice);

router.get('/time-series/intraday/:symbol', validateUser, DashboardController.getTimeSeriesIntraday);

router.get('/time-series/daily/:symbol', validateUser, DashboardController.getTimeSeriesDaily);

router.get('/time-series/monthly/:symbol', validateUser, DashboardController.getTimeSeriesMonthly);

router.get('/time-series/yearly/:symbol', validateUser, DashboardController.getTimeSeriesYearly);

module.exports = router;
