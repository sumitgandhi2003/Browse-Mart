const express = require("express");
const router = express.Router();
const register = require("../controllers/authController/register");
const login = require("../controllers/authController/login");
const forgetPassword = require("../controllers/authController/forgetPassword");
const verifyOtp = require("../controllers/authController/verifyOtp");
const resetPassword = require("../controllers/authController/resetPassword");
const verifyOTPForRegistration = require("../controllers/authController/verifyOTPForRegistration");
const otpVerification = require("../middleware/otpVerification");
router.route("/register").post(register);
router
  .route("/email-verification")
  .post(otpVerification, verifyOTPForRegistration);
router.route("/login").post(login);
router.route("/forget-password").post(forgetPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/set-password").post(resetPassword);
module.exports = router;
