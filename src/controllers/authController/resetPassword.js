import sendEmail from "../../services/emailService.js";
import User from "../../model/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required!",
      });
    }

    let decoded = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token!" });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "You are not a Registered User!" });
    }
    user.password = newPassword;
    user.otp = null;
    user.expireAt = null;
    await user.save();
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="background: #007bff; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0;">Password Reset Successful</h2>
            <p>Hello <strong>${user.name || user.email}</strong>,</p>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this request, please contact our support team immediately.</p>
            <a href="https://browsemart.vercel.app/login" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; margin-top: 20px;">Login to Your Account</a>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">Thank you,<br> The BrowseMart Team</p>
          </div>
        </div>
      `;
    await sendEmail(user?.email, "Your Password Has Been Changed", htmlContent);
    res.status(200).json({
      success: true,
      message:
        "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error resetting password" });
  }
};

export default resetPassword;
