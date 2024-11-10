const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const isLoggedIn = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return UnauthenticatedError("Authentication invalid");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //setting new property named user in req object
    req.admin = await Admin.findById(decoded.id);
    console.log('from---------auth', req.admin);
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = isLoggedIn;

