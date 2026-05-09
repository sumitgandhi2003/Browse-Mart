import User from "../../model/userSchema.js";

/**
 * POST /api/user/change-password
 * Requires: userAuthentication middleware (req.user populated)
 * Body: { currentPassword, newPassword, confirmPassword }
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;

  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Block Google-only users (no password set) from this route
    if (!user.password || user.hasPassword === false) {
      return res.status(400).json({
        success: false,
        message: "No password is set on this account. Use 'Set Password' instead.",
      });
    }

    const isMatch = await user.passwordCompare(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

export default changePassword;
