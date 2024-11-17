const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/Customer");
const {ERROR_MESSAGES,STATUS_CODES,SUCCESS_MESSAGES} = require("../../src/utils/constants.js");
const Response = require("../../src/utils/response.js");
const {loginSchema,customerSignUpSchema} = require("../../src/middleware/joi.validation.js");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const { value, error } = customerSignUpSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      const existingCustomerByEmail = await Customer.findOne({ email: value.email });
      if (existingCustomerByEmail) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.EMAIL_EXIST,
          STATUS_CODES.BAD_REQUEST
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.password, salt);
      value.password = hashedPassword;
      const newCustomer = new Customer(value);
      await newCustomer.save();
      const token = jwt.sign(
        { id: newCustomer._id, email: newCustomer.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      newCustomer.token = token;
      await newCustomer.save();
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CUSTOMER_REGISTER,
        newCustomer
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  
  login: async (req, res, next) => {
    try {
      const { value, error } = loginSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      const { email, password } = value;
      let customer = await Customer.findOne({ email: email });
      if (!customer) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );
      }
      const passwordMatch = await bcrypt.compare(password, customer.password);
      if (!passwordMatch) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.PASSWORD_INVALID,
          STATUS_CODES.BAD_REQUEST
        );
      }
      const token = jwt.sign(
        { id: customer._id }, 
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      await Customer.updateOne(
        { _id: customer._id },
        { $set: { token: token } }
      );
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.CUSTOMER_LOGIN,
        customer
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
