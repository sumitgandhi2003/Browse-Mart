const mongoose = require("mongoose");
const sellerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  business_name: { type: String, required: true },
  pan: { type: String, required: true },
  gst: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String },
  business_address: { type: String },
  business_type: { type: String },
  opening_hours: { type: String },
  website_url: { type: String },
  logo: { type: String },
  company_registration_number: { type: String },
  trade_license_number: { type: String },
  bank_account_number: { type: String },
  bank_name: { type: String },
  ifsc_code: { type: String },
  social_media_links: [{ type: String }],
  feedback_rating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  verification_documents: [{ type: String }], // URLs to verification documents
  shipping_methods: [{ type: String }],
  shipping_addresses: [{ type: String }],
});
const sellerUser = mongoose.model("Selleruser", sellerSchema);
module.exports = sellerUser;
