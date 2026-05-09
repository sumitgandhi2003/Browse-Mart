import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

/**
 * GET /api/auth/google
 * Returns the Google OAuth authorization URL for the frontend to redirect to.
 */
const googleAuth = (req, res) => {
  try {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "select_account", // Always show account picker
    });

    return res.status(200).json({ success: true, url: authUrl });
  } catch (error) {
    console.error("Google Auth URL Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate Google login URL" });
  }
};

export { oauth2Client };
export default googleAuth;
