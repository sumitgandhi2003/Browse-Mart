const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures the same email isn't subscribed multiple times
    lowercase: true,
    trim: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true, // Initially, users are subscribed
  },
  createdAt: {
    type: Date,
    default: Date.now, // Tracks when the user subscribed
  },
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;
