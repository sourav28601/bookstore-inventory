const Book = require("../models/Book");
const {STATUS_CODES,SUCCESS_MESSAGES,ERROR_MESSAGES} = require("../../src/utils/constants.js");
const Response = require("../../src/utils/response.js");
const {
  addBookSchema,
  bookQuerySchema,
  searchQuerySchema,
  bookIdSchema,
} = require("../../src/middleware/joi.validation.js");

module.exports = {
  createBook: async (req, res, next) => {
    try {
      const { value, error } = addBookSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      const bookExist = await Book.findOne({ title: value.title });
      if (bookExist) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.BOOK_EXIST,
          STATUS_CODES.CONFLICT
        );
      }
      const book = new Book(value);
      await book.save();
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.BOOK_ADDED,
        book
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  getBooks: async (req, res, next) => {
    try {
      const { value, error } = bookQuerySchema.validate(req.query);
      if (error) return Response.joiErrorResponseData(res, error);
      const { genre, author, minPrice, maxPrice, page = 1, limit = 10 } = value;
      const query = {};
      if (genre) query.genre = genre;
      if (author) query.author = author;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }
      const books = await Book.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await Book.countDocuments(query);
      return Response.successResponseData(res, SUCCESS_MESSAGES.BOOKS_FETCHED, {
        books,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  updateBook: async (req, res, next) => {
    try {
      const { error: idError } = bookIdSchema.validate({ id: req.params.id });
      if (idError) return Response.joiErrorResponseData(res, idError);
      const book = await Book.findById(req.params.id);
      if (!book) {
        return Response.errorResponseWithoutData(
          res,
          SUCCESS_MESSAGES.BOOK_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }

      if (req.body.title && req.body.title !== book.title) {
        const bookExist = await Book.findOne({ title: req.body.title });
        if (bookExist) {
          return Response.errorResponseWithoutData(
            res,
            SUCCESS_MESSAGES.BOOK_EXIST,
            STATUS_CODES.CONFLICT
          );
        }
      }

      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.BOOK_UPDATED,
        updatedBook
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },

  deleteBook: async (req, res, next) => {
    try {
      const { error } = bookIdSchema.validate({ id: req.params.id });
      if (error) return Response.joiErrorResponseData(res, error);
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return Response.errorResponseWithoutData(
          res,
          SUCCESS_MESSAGES.BOOK_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }
      return Response.successResponseWithoutData(
        res,
        SUCCESS_MESSAGES.BOOK_DELETED
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
