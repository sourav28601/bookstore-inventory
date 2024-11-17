const express = require('express');
const authRoute = express.Router();
const authController = require('../controller/auth.controller');

authRoute.post('/signup',authController.signup);
authRoute.post('/login',authController.login);

module.exports = authRoute;