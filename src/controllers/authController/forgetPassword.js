import User from "../../model/userSchema.js";
import sendOtpEmail from "../../services/otpService.js";
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req?.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ sucess: false, message: "You are not a Registered User!" });
    }
    const otp = await sendOtpEmail(email, "Your OTP for Password Reset");

    if (otp) {
      existingUser.otp = otp;
      existingUser.otpExpireAt = new Date(Date.now() + 10 * 60 * 1000);
      existingUser.save();
      return res.status(200).json({
        success: true,
        message:
          "Your OTP has been sent! Kindly check your inbox or spam folder.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please try again shortly.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending email", error });
  }
};

export default forgetPassword;
