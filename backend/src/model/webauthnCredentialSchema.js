import mongoose from "mongoose";

const webauthnCredentialSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    credential_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    public_key: {
      type: Buffer,
      required: true,
    },
    sign_count: {
      type: Number,
      required: true,
      default: 0,
    },
    transports: {
      type: [String],
      default: [],
    },
    device_name: {
      type: String,
      default: "Passkey",
    },
    backed_up: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    last_used_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const WebauthnCredential = mongoose.model(
  "WebauthnCredential",
  webauthnCredentialSchema
);

export default WebauthnCredential;
