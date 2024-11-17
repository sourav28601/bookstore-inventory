module.exports = {
  STATUS_CODES: {
    ACCESS_DENIED: 401,
    BAD_REQUEST: 400,
    OK: 200,
    INTERNAL_ERROR: 500,
    NOT_FOUND: 404,
    CONFLICT: 409
  },
  ACTIVE: "ACTIVE",

  SUCCESS_MESSAGES: {
    BOOK_ADDED: 'Book added successfully',
    BOOK_UPDATED: 'Book updated successfully',
    BOOK_DELETED: 'Book deleted successfully',
    BOOK_FETCHED: 'Book fetched successfully',
    BOOKS_FETCHED: 'Books fetched successfully',
    BOOK_NOT_FOUND: 'Book not found',
    ORDER_DELETED: 'Order deleted successfully',
    ORDER_UPDATED: 'Order updated successfully',
    ORDER_FETCHED: 'Orders fetched successfully',
    ORDER_NOT_FOUND: 'Order not found',
    ORDER_CREATED: 'Order created successfully',
    CUSTOMER_LOGIN:"Login successfully",
    CUSTOMER_REGISTER:"Register successfully"
  },

  ERROR_MESSAGES: {
    BOOK_EXIST: 'Book already exists',
    EMAIL_EXIST: "Email already exists",
    EMAIL_NOT_FOUND: "Email does not exist",
    CLIENT_ERROR: "Something went wrong",
    UNAUTHORIZED: "Unauthorized access",
    PASSWORD_INVALID: "Invalid Email and Password.",
    PASSWORD_NOT_MATCH: "New password and confirm password do not match.",
    CUSTOMER_NOT_FOUND: "Customer does not exist",
    INTERNAL_SERVER_ERROR: "An error occurred while processing your request. Please try again later",
    ORDER_NOT_FOUND: "Order not found",
    ORDER_CREATION_FAILED: "Order creation failed. Please try again",
    ORDER_UPDATE_FAILED: "Failed to update the order. Please check the details and try again",
    ORDER_DELETION_FAILED: "Failed to delete the order. Please try again",
    INSUFFICIENT_BOOKS:"Insufficient stock for some book"
  },

  ORDER_STATUS: {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled"
  },

  ORDER_PAYMENT_STATUS: {
    PAID: "Paid",
    UNPAID: "Unpaid",
    REFUNDED: "Refunded"
  },

  ORDER_STATUS_CODES: {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    DELIVERED: 3,
    CANCELLED: 4
  },

  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  }
};
