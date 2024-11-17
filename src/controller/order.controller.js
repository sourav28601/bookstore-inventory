const Order = require("../models/Order");
const Book = require("../models/Book");
const {STATUS_CODES,SUCCESS_MESSAGES,ERROR_MESSAGES} = require("../../src/utils/constants.js");
const Response = require("../../src/utils/response.js");
const {createOrderSchema,orderQuerySchema,orderIdSchema} = require("../../src/middleware/joi.validation.js");

module.exports = {
  createOrder: async (req, res, next) => {
    try {
      const { error, value } = createOrderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const bookIds = value.items.map(item => item.book);
      const books = await Book.find({ '_id': { $in: bookIds } });
      const insufficientStock = value.items.find(item => {
        const book = books.find(b => b._id.toString() === item.book);
        return book && book.stock < item.quantity;
      });
      if (insufficientStock) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.INSUFFICIENT_BOOKS,
          STATUS_CODES.CONFLICT
        );
      }
      const totalAmount = value.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const newOrder = new Order({
        customer: value.customer,
        items: value.items,
        totalAmount, 
      });
      await newOrder.save();
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.ORDER_CREATED,
        newOrder
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const { value, error } = orderQuerySchema.validate(req.query);
      if (error) return Response.joiErrorResponseData(res, error);
  
      const {
        customer,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = value;
      const query = {};
      if (customer) query["customer.email"] = customer;
      if (status) query.status = status;
      if (startDate || endDate) {
        query.orderDate = {};
        if (startDate) query.orderDate.$gte = new Date(startDate);
        if (endDate) query.orderDate.$lte = new Date(endDate);
      }
      const orders = await Order.find(query)
        .populate("items.book") 
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ orderDate: -1 }) 
        .exec();
      const count = await Order.countDocuments(query);
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.ORDER_FETCHED,
        {
          orders,
          pagination: {
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
          },
        }
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  updateOrder: async (req, res, next) => {
    try {
      const { error: idError } = orderIdSchema.validate({ id: req.params.id });
      if (idError) return Response.joiErrorResponseData(res, idError);
  
      const { status, books } = req.body;
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return Response.errorResponseWithoutData(
          res,
          SUCCESS_MESSAGES.ORDER_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }
      if (books) {
        const restoreUpdates = order.items.map((item) => ({
          updateOne: {
            filter: { _id: item.book },
            update: { $inc: { stock: item.quantity } },
          },
        }));
  
        await Book.bulkWrite(restoreUpdates); 
        let totalAmount = 0;
        const newBookUpdates = [];
        for (const item of books) {
          const book = await Book.findById(item.book);
          if (!book) {
            throw new Error(`Book with ID ${item.book} not found`);
          }
  
          if (book.stock < item.quantity) {
            throw new Error(`Insufficient stock for book: ${book.title}`);
          }
  
          totalAmount += book.price * item.quantity;
          newBookUpdates.push({
            updateOne: {
              filter: { _id: item.book },
              update: { $inc: { stock: -item.quantity } },
            },
          });
        }
        await Book.bulkWrite(newBookUpdates); 
        order.items = books;
        order.totalAmount = totalAmount;
      }
      if (status) {
        order.status = status;
      }
      await order.save();
      const updatedOrder = await Order.findById(order._id).populate("items.book");
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.ORDER_UPDATED,
        updatedOrder
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.BAD_REQUEST
      );
    }
  },
  
  deleteOrder: async (req, res, next) => {
    try {
      const { error } = orderIdSchema.validate({ id: req.params.id });
      if (error) return Response.joiErrorResponseData(res, error);
      const order = await Order.findById(req.params.id);
      if (!order) {
        return Response.errorResponseWithoutData(
          res,
          SUCCESS_MESSAGES.ORDER_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }
      const bookUpdates = order.items.map((item) => ({
        updateOne: {
          filter: { _id: item.book },
          update: { $inc: { stock: item.quantity } },
        },
      }));
      await Book.bulkWrite(bookUpdates);
      await Order.deleteOne({ _id: req.params.id });
      return Response.successResponseWithoutData(
        res,
        SUCCESS_MESSAGES.ORDER_DELETED
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }
};
