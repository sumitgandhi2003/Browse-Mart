import User from "../../model/userSchema.js";

/**
 * POST /api/user/set-password
 * Allows Google-login users (who have no password) to set one.
 * Requires: userAuthentication middleware (req.user is populated).
 */
const setPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const userId = req.user._id;

  try {
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both password fields are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Set the password — the pre('save') bcrypt hook will hash it
    user.password = newPassword;
    user.hasPassword = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password set successfully! You can now log in with email & password.",
      hasPassword: true,
    });
  } catch (error) {
    console.error("Set Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

export default setPassword;
