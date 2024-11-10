const express = require("express");
const router = express.Router();
const { adminRegister, adminLogin, adminLogout, adminForgotPassword, adminPasswordReset, adminChangePassword } = require("../controllers/admin")
//, adminLogout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminGetAllUser, managerAllUser, adminGetOneUser, adminUpdateOneUserDetails, adminDeleteOneUser } = require("../controllers/userController")
// const { isLoggedIn, customRole } = require("../middlewares/user")
const isLoggedIn  = require("../middlewares/authentation")


router.route("/adminRegister").post(adminRegister);
router.route("/adminLogin").post(adminLogin);
router.route("/adminLogout").get(adminLogout);
router.route("/adminForgotPassword").post(adminForgotPassword);
router.route("/adminPassword/reset/:token").post(adminPasswordReset); 
router.route("/adminPassword/update").post(isLoggedIn, adminChangePassword)
// router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails)
// 
// router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails)

module.exports = router;
