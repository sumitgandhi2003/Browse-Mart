import Newsletter from "../../model/newsLetter.js";

/**
 * GET /api/newsletter/unsubscribe?token=<unsubscribeToken>
 * Public — no auth required. Accessed via link inside newsletter emails.
 */
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send(buildHtmlPage("Invalid Link", "The unsubscribe link is missing a token.", false));
    }

    const subscriber = await Newsletter.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return res.status(404).send(buildHtmlPage("Not Found", "No subscriber found for this link. It may have already been used.", false));
    }

    if (!subscriber.isSubscribed) {
      return res.status(200).send(buildHtmlPage("Already Unsubscribed", "You are already unsubscribed from Browse Mart newsletters.", true));
    }

    subscriber.isSubscribed = false;
    await subscriber.save();

    return res.status(200).send(buildHtmlPage("Unsubscribed", "You have been successfully unsubscribed. You will no longer receive newsletter emails from Browse Mart.", true));
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).send(buildHtmlPage("Server Error", "Something went wrong. Please try again later.", false));
  }
};

/**
 * Builds a simple, branded HTML response page for unsubscribe actions.
 */
const buildHtmlPage = (title, message, success) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Browse Mart</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f3f0ff 0%, #ede9fe 100%);
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 24px;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 48px 40px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(76, 29, 149, 0.15);
    }
    .icon {
      font-size: 56px;
      margin-bottom: 20px;
    }
    .brand {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #7c3aed;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #1e1b4b;
      margin-bottom: 14px;
    }
    p {
      font-size: 15px;
      color: #64748b;
      line-height: 1.7;
      margin-bottom: 32px;
    }
    a {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed, #4c1d95);
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 36px;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? "✅" : "❌"}</div>
    <div class="brand">Browse Mart</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://browse-mart.vercel.app">Return to Browse Mart</a>
  </div>
</body>
</html>
`;

export default unsubscribeNewsletter;
