const express = require('express');

const validateUser = require('../middleware/validateUser');
const DashboardController = require('../controllers/dashboard');

const router = express.Router();

router.get('/stock-overview/:symbol', validateUser, DashboardController.getStockOverview);

router.get('/time-series/intraday/:symbol', validateUser, DashboardController.getTimeSeriesIntraday);

router.get('/time-series/daily/:symbol', validateUser, DashboardController.getTimeSeriesDaily);

router.get('/time-series/weekly/:symbol', validateUser, DashboardController.getTimeSeriesWeekly);

router.get('/time-series/monthly/:symbol', validateUser, DashboardController.getTimeSeriesMonthly);

router.get('/trending-stocks', validateUser, DashboardController.getTrending);

router.get('/predict-price/:symbol', validateUser, DashboardController.predictPrice);

router.get('/search-symbols/:query', validateUser, DashboardController.searchSymbols);

module.exports = router;
