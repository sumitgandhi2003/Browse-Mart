import mongoose from "mongoose";

const webauthnRecoverySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  recovery_token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  cancel_token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  cooling_off_until: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["cooling_off", "ready", "cancelled", "completed"],
    default: "cooling_off",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const WebauthnRecovery = mongoose.model(
  "WebauthnRecovery",
  webauthnRecoverySchema
);

export default WebauthnRecovery;
