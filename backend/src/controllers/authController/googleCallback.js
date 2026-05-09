import { google } from "googleapis";
import User from "../../model/userSchema.js";

/**
 * POST /api/auth/google/callback
 * Creates a FRESH oauth2Client per request to avoid shared-state
 * issues on Vercel serverless cold starts.
 */
const googleCallback = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res
      .status(400)
      .json({ success: false, message: "Authorization code is required." });
  }

  try {
    // ✅ New client per request — safe for serverless
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    // 1. Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Fetch user info from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    const { id: googleId, email, name, picture } = googleUser;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Could not retrieve email from Google. Please try again.",
      });
    }

    // 3. Find existing user by email
    let user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      // ── Existing user ──
      if (user.status === "blocked") {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended by the administrator.",
        });
      }

      // Link googleId if they previously registered with email/password
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // ── New user — register via Google ──
      user = new User({
        name: name || email.split("@")[0],
        email: email.trim().toLowerCase(),
        googleId,
        profilePic: picture || null,
        isVerified: true,
        hasPassword: false,
        TandC: true,
      });
      await user.save();
    }

    // 4. Generate JWT and respond
    const authToken = user.generateToken();
    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      AuthToken: authToken,
    });
  } catch (error) {
    console.error("Google Callback Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Google authentication failed. Please try again.",
      error: error.message,
    });
  }
};

export default googleCallback;
