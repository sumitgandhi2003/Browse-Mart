import Newsletter from "../../model/newsLetter.js";
import { sendWelcomeEmail } from "../../services/newsletterEmailService.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter/subscribe
 * Public — no auth required. Guests and logged-in users can both subscribe.
 */
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if subscriber already exists
    const existing = await Newsletter.findOne({ email: normalizedEmail });

    if (existing) {
      // Re-activate if they had previously unsubscribed
      if (!existing.isSubscribed) {
        existing.isSubscribed = true;
        await existing.save();
        // Fire-and-forget welcome email (safe for Vercel serverless)
        sendWelcomeEmail(normalizedEmail, existing.unsubscribeToken).catch(console.error);
        return res.status(200).json({
          success: true,
          message: "Welcome back! You have been re-subscribed to our newsletter.",
        });
      }
      // Already actively subscribed
      return res.status(200).json({
        success: false,
        already: true,
        message: "This email is already subscribed to our newsletter.",
      });
    }

    // New subscriber
    const subscriber = await Newsletter.create({ email: normalizedEmail });

    // Fire-and-forget welcome email
    sendWelcomeEmail(normalizedEmail, subscriber.unsubscribeToken).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed! Check your inbox for a welcome email.",
    });
  } catch (error) {
    console.error("Subscribe newsletter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export default subscribeNewsletter;
