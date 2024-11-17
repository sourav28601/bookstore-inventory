const express = require('express');
const bookRoute = express.Router();
const bookController = require('../controller/book.controller');
const userAuth = require('../../src/middleware/user.auth');

bookRoute.post('/create',userAuth,bookController.createBook);
bookRoute.get('/all',bookController.getBooks);
bookRoute.put('/update/:id',userAuth,bookController.updateBook);
bookRoute.delete('/delete/:id',userAuth,bookController.deleteBook);

module.exports = bookRoute;