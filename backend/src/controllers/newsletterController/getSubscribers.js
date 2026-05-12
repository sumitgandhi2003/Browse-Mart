import Newsletter from "../../model/newsLetter.js";

/**
 * GET /api/newsletter/subscribers
 * Admin only — returns paginated list and total count of active subscribers.
 */
const getSubscribers = async (req, res) => {
  try {
    const total = await Newsletter.countDocuments({ isSubscribed: true });
    const totalAll = await Newsletter.countDocuments();

    return res.status(200).json({
      success: true,
      total,         // active subscribers
      totalAll,      // including unsubscribed
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({ success: false, message: "Server error retrieving subscribers." });
  }
};

export default getSubscribers;
