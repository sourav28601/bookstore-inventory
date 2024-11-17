const express = require('express');
const orderRoute = express.Router();
const orderController = require('../controller/order.controller');
const userAuth = require('../../src/middleware/user.auth');

orderRoute.post('/create',userAuth,orderController.createOrder);
orderRoute.get('/all',userAuth,orderController.getOrders);
orderRoute.put('/update/:id',userAuth,orderController.updateOrder);
orderRoute.delete('/delete/:id',userAuth,orderController.deleteOrder);

module.exports = orderRoute;