const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const { errorResponseWithoutData } = require("../utils/response");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return errorResponseWithoutData(res, "Unauthorized access");
    }
    token = token.split(" ")[1];
    await jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return errorResponseWithoutData(res, "Unauthorized access");
      } else {
        req.user = await Customer.findOne({token: token});
      }
      next();
    });
  } catch (error) {
    console.log("error in middleware", error);
  }
};
