const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your firstName"],
    maxlength: [40, "firstName should be under 40 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your lastName"],
    maxlength: [40, "lastName should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "Please enter email in correct format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password should be atleast 6 chars"],
    select: false, //when we bring usermodel, password field will not come, if i want to bring password(for password comparision), then i need to explicitly mention that(this scenario occues when user is changing the password)
  },
  role: {
    type: String,
    default: "user",
  },
  phoneNumber: {
    type: String,
    unique: [true, "Phone number is already in use."],
    match: [/^[0-9]{10}$/, "Please provide a valid phone number"],
  },
  dateOfBirth: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
    minlength: [20, "Address should be atleast 20 chars"],
    maxlength: [400, "Address should be under 400 characters"],
  },
  shortAddress: {
    type: String,
    minlength: [5, "shortAddress should be atleast 5 chars"],
    maxlength: [200, "shortAddress should be under 200 characters"],
  },
  pinCode: {
    type: String,
    required: [true, "Please provide a pincode"],
    match: [/^[0-9]{6}$/, "Please provide a valid pin code"],
  },
  zone: {
    type: String,
    default: "",
  },
  googleMapURL: {
    type: String,
    default: "",
  },
  rate: {
    veg: {
      type: String,
      default: "100",
    },
    chicken: {
      type: String,
      default: "120",
    },
    fish: {
      type: String,
      default: "140",
    },
    egg: {
      type: String,
      default: "130",
    },
  },
  amountPaidOnCurrentMonth: {
    type: String,
    default: 0,
  },
  currentBalance: {
    type: String,
    default: 0,
  },
  allPayments: [
    {
      paidDate: {
        type: Date,
        default: Date.now,
      },
      amount: {
        type: String,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
