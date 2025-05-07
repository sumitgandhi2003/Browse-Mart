import User from "../../model/userSchema.js";
const verifyOTPForRegistration = async (req, res) => {
  try {
    const foundedUser = req?.user;
    // const user = await User.findOne({ email });
    // if (!user) return res.status(400).json({ message: "User not found" });

    // if (user.otp !== otp || new Date() > user.otpExpireAt) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid or Expired OTP! Please try again.",
    //   });
    // }
    // // ✅ OTP is correct, so clear OTP fields
    // user.otp = undefined;
    // user.otpExpireAt = undefined;
    // user.isVerified = true;
    // await user.save();
    // ✅ Generate JWT Token
    const authToken = foundedUser?.isVerified
      ? await foundedUser?.generateToken()
      : null;

    res
      .status(201)
      .json({ message: "Account successfully registered", authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyOTPForRegistration;
