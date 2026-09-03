import mongoose from "mongoose";

const webauthnChallengeSchema = new mongoose.Schema({
  challenge: {
    type: String,
    required: true,
  },
  challengeKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: ["registration", "authentication", "reauth", "recovery"],
    required: true,
  },
  userHandle: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // Automatically expired and removed after 60 seconds
  },
});

const WebauthnChallenge = mongoose.model(
  "WebauthnChallenge",
  webauthnChallengeSchema
);

export default WebauthnChallenge;
