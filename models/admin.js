const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema({
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
    default: "admin",
  },
  phoneNumber: {
    type: String,
    unique: [true, "Phone number is already in use."],
    match: [/^[0-9]{10}$/, "Please provide a valid phone number"],
    default: "",
  },
  dateOfBirth: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
});



//encrypting password before save(using life cycle event of mongoose-hooks)
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //if password is not modified then give the control to the next function & contiue the work, if it is modified then hash the password & save it
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}); //just before saving the data

//validate the password  (which is given by the user while login), isValidatedPassword is custome function
adminSchema.methods.comparePassword = async function (userSendPassword) {
    return await bcrypt.compare(userSendPassword, this.password)
}

//create and return JWT token
adminSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

//generate forget password token(string)
adminSchema.methods.getForgotPasswordToken = function () {
  //generate a long & random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  //create a hash using the forgetToken string & store it in DB(this value is used in future , to decypt the token & compare it with the string which user passes)
  this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest("hex");

  //time of that token
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000 //20 minutes to expire the token
  //if we are sending this forgotToken to frontend then we are expecting the same token from 
  //frontend(once we receive the token from frontend we encrypt it using crypto & compare it with the encrypted(using crypto) values stored in DB)
  return forgotToken
}

module.exports = mongoose.model("Admin", adminSchema);