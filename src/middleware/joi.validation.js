const Joi = require("joi");
const mongoose = require("mongoose");

// Authentication Schemas
const loginSchema = Joi.object({
  email: Joi.string().email().trim().min(1).max(255).required(),
  password: Joi.string().min(6).max(20).required(),
});
const customerSignUpSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().min(1).max(255).required(),
  password: Joi.string().min(6).max(20).required(),
});

// Book Schemas
const addBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title cannot exceed 255 characters",
  }),
  author: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Author name cannot be empty",
    "string.min": "Author name must be at least 2 characters long",
  }),
  genre: Joi.string()
    .valid(
      "Fiction",
      "Non-Fiction",
      "Science",
      "Technology",
      "History",
      "Biography"
    )
    .required()
    .messages({
      "any.only":
        "Genre must be one of: Fiction, Non-Fiction, Science, Technology, History, Biography",
    }),
  isbn: Joi.string().required().messages({
    "string.empty": "ISBN is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  description: Joi.string().trim().max(1000).optional(),
  stockQuantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock quantity must be a number",
    "number.integer": "Stock quantity must be an integer",
    "number.min": "Stock quantity cannot be negative",
  }),
});
const updateBookSchema = addBookSchema.fork(
  ["title", "author", "genre", "isbn", "price", "stockQuantity"],
  (schema) => schema.optional()
);
const bookQuerySchema = Joi.object({
  genre: Joi.string().valid(
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "History",
    "Biography"
  ),
  author: Joi.string().trim(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(Joi.ref("minPrice")),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});
const searchQuerySchema = Joi.object({
  q: Joi.string().required().trim().min(1).messages({
    "string.empty": "Search query cannot be empty",
    "any.required": "Search query is required",
  }),
});
const bookIdSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Invalid book ID format",
      "any.required": "Book ID is required",
    }),
});

// Order Schemas
const orderItemSchema = Joi.object({
  bookId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Invalid book ID format",
      "any.required": "Book ID is required",
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  totalPrice: Joi.number().min(0).required().messages({
    "number.base": "Total price must be a number",
    "number.min": "Total price must be at least 0",
    "any.required": "Total price is required",
  }),
});

const createOrderSchema = Joi.object({
  customer: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
  items: Joi.array()
    .items(
      Joi.object({
        book: Joi.string()
          .required()
          .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.error("any.invalid");
            }
            return value;
          }),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid(
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ),
  books: Joi.array().items(orderItemSchema).min(1),
})
  .min(1)
  .messages({
    "object.min": "At least one field (status or books) must be provided",
  });

const orderQuerySchema = Joi.object({
  customer: Joi.string().email(),
  status: Joi.string().valid(
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

const orderIdSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Invalid order ID format",
      "any.required": "Order ID is required",
    }),
});

module.exports = {
  loginSchema,
  customerSignUpSchema,
  addBookSchema,
  updateBookSchema,
  bookQuerySchema,
  searchQuerySchema,
  bookIdSchema,
  createOrderSchema,
  orderQuerySchema,
  orderIdSchema,
};
