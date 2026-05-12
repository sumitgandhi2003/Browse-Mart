import mongoose from "mongoose";
import crypto from "crypto";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    // Secure token used to unsubscribe without needing to be logged in
    unsubscribeToken: {
      type: String,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
