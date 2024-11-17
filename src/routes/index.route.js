const express = require('express');
const route = express.Router();
const authRoute = require('./auth.route');
const bookRoute = require('./book.route');
const orderRoute = require("./order.route");

route.use('/auth',authRoute);
route.use('/book',bookRoute);
route.use('/order',orderRoute);

module.exports = route;