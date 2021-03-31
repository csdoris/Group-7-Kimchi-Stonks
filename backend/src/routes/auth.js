const express = require('express');

const validateUser = require('../middleware/validateUser');
const AuthController = require('../controllers/auth');

const router = express.Router();

router.post('/register', AuthController.registerNewUser);

router.post('/login', AuthController.loginUser);

router.get('/autoLogin', validateUser, AuthController.autoLoginUser);

module.exports = router;
