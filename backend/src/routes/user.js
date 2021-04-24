const express = require('express');

const validateUser = require('../middleware/validateUser');
const UserController = require('../controllers/user');

const router = express.Router();

router.get('/info', validateUser, UserController.getUserInformation);

router.post('/add', validateUser, UserController.addBuyingPower);

router.post('/buy', validateUser, UserController.buyStock);

router.post('/sell', validateUser, UserController.sellStock);

module.exports = router;
