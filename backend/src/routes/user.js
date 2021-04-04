const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

router.post('/buy', UserController.buyStock);

router.get('/:id/info', UserController.getUserInformation);

router.post('/:id/add', UserController.addCreditsToUser);

module.exports = router;
