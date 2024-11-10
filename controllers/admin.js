const Admin = require("../models/admin");
const cookieToken = require("../utils/cookieToken");
const mailHelper = require("../utils/emailHelper");
const logger = require("../utils/logger");

exports.adminRegister = async (req, res) => {
  try {
    logger.info("Inside adminRegister controller function");
    const { firstName, lastName, email, password, dob, phoneNumber } = req.body;
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

exports.adminLogin = async (req, res) => {
  logger.info("Inside adminLogin controller function");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide Email/Password" });
    }
    //get user from DB
    const adminUser = await Admin.findOne({ email }).select("+password"); //bring password field as well when bringing the User document
    //if user not found in or DB
    if (!adminUser) {
      return res.status(400).json({ msg: "User not found" });
    }

    //match the password
    const isPasswordCorrect = await adminUser.comparePassword(password);
    //if password do not match
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ msg: "Email or password does not match or exist!" });
    }
    //if all goes good we send the token
    cookieToken(adminUser, res);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
};

exports.adminLogout = async (req, res) => {
  //setting token value to null(in cookie)
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Success!",
  });
};

exports.adminForgotPassword = async (req, res) => {
  //collect email
  const { email } = req.body;
  //find user in DB
  const adminUser = await Admin.findOne({ email });
  //if user not found in DB
  if (!adminUser) {
    return res.status(400).json({ msg: "Email not found as registered" });
  }
  //get token from admin model methods
  const forgotToken = await adminUser.getForgotPasswordToken();

  //save forgotToken in DB, i,e save the data
  await adminUser.save({ validateBeforeSave: false });
  //creating a URL:- protocol is http or https   ://Host name like: localhost:4000 or burmanfood/password/reset/bigtokengoeshere
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  //craft a message
  const message = `Copy paste this link in your URL & hit enter \n\n ${myUrl} `;

  //Now send forgot pasword email to the user
  try {
    await mailHelper({
      email: adminUser.email,
      subject: "Burman Foods -- Password reset email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    //if email is not properly send, then clear those stored field from DB, so that user will try again with newer expiry time of 20min
    adminUser.forgotPasswordToken = undefined;
    adminUser.forgotPasswordExpiry = undefined;
    //save above balues in to DB
    await adminUser.save({ validateBeforeSave: false });
    logger.error(error);
    res.status(500).send(error.message);
  }
};

//reset the passord after receiving the email
exports.adminPasswordReset = async (req, res) => {
  const token = req.params.token;
  const encryptionToken = crypto.createHash('sha256').update(token).digest("hex");

  //check for encryptionToken & also check the time(it should be greater then forgotPasswordExpiry then only allow user to change the password)
  const adminUser = await Admin.findOne({ forgotPasswordToken: encryptionToken, forgotPasswordExpiry: { $gt: Date.now() } })

  if (!adminUser) {
    return res.status(400).json({ msg: "Token is invalid or expired" });
  }

  if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ msg: "Password & confirm password do not match" });
  }

  //updating new password in DB
  adminUser.password = req.body.password;
  adminUser.forgotPasswordToken = undefined;
  adminUser.forgotPasswordExpiry = undefined;
  await adminUser.save();
  //send json response/token
  cookieToken(user, res);
}

//change the password when you know the password
exports.adminChangePassword = async (req, res) => {
  const Id = req.admin.id;
  const admin = await Admin.findById(Id).select("+password");
  const isCorrectOldPassword = await admin.comparePassword(req.body.oldPassword);

  if (!isCorrectOldPassword) {
      return res.status(400).json({ msg: "Old password is incorrect" });
  }
  admin.password = req.body.newPassword;
  //saving new password
  await admin.save();
  //update the user token & cookie as well
  cookieToken(admin, res);
}