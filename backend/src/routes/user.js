const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

router.post('/buy', UserController.buyStock);

router.get('/info', UserController.getUserInformation);

router.post('/add', UserController.addCreditsToUser);

router.post('/sell', UserController.sellStock);

module.exports = router;
