import { google } from "googleapis";

/**
 * GET /api/auth/google
 * Creates a fresh oauth2Client per request and returns the Google OAuth URL.
 */
const googleAuth = (req, res) => {
  try {
    // ✅ New client per request — safe for serverless
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "select_account",
    });

    return res.status(200).json({ success: true, url: authUrl });
  } catch (error) {
    console.error("Google Auth URL Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate Google login URL" });
  }
};

export default googleAuth;
