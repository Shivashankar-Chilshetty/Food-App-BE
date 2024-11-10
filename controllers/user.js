const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const cookieToken = require("../utils/cookieToken");

exports.userRegister = async (req, res) => {
  try {
    logger.info("Inside userRegister controller function");
    const {
      firstName,
      lastName,
      email,
      password,
      dob,
      phoneNumber,
      address,
      shortAddress,
      pinCode,
      zone,
      googleMapURL,
      rate,
      amountPaid,
      currentBalance,
      allPayments,
    } = req.body;
    if (!email || !password) {
      //Please provide email & Password
      return res.status(400).json({ msg: "Please provide email & Password" });
    }
    if (!firstName || !lastName || !phoneNumber) {
      return res
        .status(400)
        .json({ msg: "Please provide firstName, lastName & phoneNumber" });
    }
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      dob,
      phoneNumber,
    });
    //setting-up the cookie for 3 days
    cookieToken(admin, res);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
};

const userRegister = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  //setting-up the cookie for 3 days
  cookieToken(user, res);
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  userRegister,
  userLogin,
};
