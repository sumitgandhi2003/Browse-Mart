import User from "../../model/userSchema.js";
import jwt from "jsonwebtoken";
const verifyOtp = async (req, res) => {
  try {
    const foundedUser = req?.user;
    // const { email, otp } = req.body;

    // if (!email || !otp) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Email and OTP are required!" });
    // }

    // const user = await User.findOne({ email });

    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "You are not a Registered User!" });
    // }

    // if (user.otp?.toString() !== otp) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid OTP! Please try again." });
    // }

    // if (new Date() > user.otpExpireAt) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP has expired! Request a new one.",
    //   });
    // }

    const resetToken = jwt.sign(
      { email: foundedUser?.email, isOtpVerified: true },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10m" }
    );
    res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

export default verifyOtp;
