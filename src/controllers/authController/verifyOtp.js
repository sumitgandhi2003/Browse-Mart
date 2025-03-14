const User = require("../../model/userSchema");
const jwt = require("jsonwebtoken");

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "You are not a Registered User!" });
    }

    if (user.otp?.toString() !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP! Please try again." });
    }

    if (new Date() > user.otpExpireAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired! Request a new one.",
      });
    }

    const resetToken = jwt.sign(
      { email, isOtpVerified: true },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10m" }
    );
    user.otp = null;
    user.expireAt = null;
    user.isVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

module.exports = verifyOtp;
