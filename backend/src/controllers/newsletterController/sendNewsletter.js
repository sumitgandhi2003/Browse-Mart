import Newsletter from "../../model/newsLetter.js";
import { sendNewsletterEmail } from "../../services/newsletterEmailService.js";

/**
 * POST /api/newsletter/send
 * Admin only — protected by userAuthentication + adminAuthentication middleware.
 * Body: { subject: string, content: string (HTML from TipTap) }
 */
const sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: "Subject is required." });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Newsletter content is required." });
    }

    // Fetch all active subscribers
    const subscribers = await Newsletter.find({ isSubscribed: true }).select("email unsubscribeToken");

    if (subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active subscribers found.",
        sent: 0,
        failed: 0,
      });
    }

    // Send to all subscribers concurrently — allSettled ensures partial failures don't stop delivery
    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        sendNewsletterEmail(sub.email, sub.unsubscribeToken, subject, content)
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled" && r.value === true).length;
    const failed = results.length - sent;

    return res.status(200).json({
      success: true,
      message: `Newsletter dispatched. ${sent} delivered, ${failed} failed.`,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

export default sendNewsletter;
