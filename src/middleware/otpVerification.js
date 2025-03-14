const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const otpVerification = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required!" });
    }
    const user = await User.findOne({ email: email?.toString()?.trim() });

    if (!user)
      return res
        .status(400)
        .json({ message: "You are not a Registered User!" });

    // if (user.otp !== otp || new Date() > user.otpExpireAt) {
    //   return {
    //     isOtpVerified: false,
    //     success: false,
    //     message: "Invalid or Expired OTP! Please try again.",
    //   };
    // }
    // const isOtpValid = await user.compareOtp(otp);
    const isOtpValid = await bcrypt.compare(otp.toString().trim(), user.otp);

    if (!isOtpValid || new Date() > user.otpExpireAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP! Please try again.",
      });
    }
    user.otp = null;
    user.otpExpireAt = null;
    user.isVerified = true;
    await user.save();
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports = otpVerification;
