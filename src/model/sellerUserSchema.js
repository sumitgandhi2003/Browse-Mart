const mongoose = require("mongoose");
const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: { type: String, required: true },
  panNumber: { type: String, required: true },
  gstNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String },
  businessAddress: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },
  country: { type: String },
  businessType: { type: String },
  // opening_hours: { type: String },
  website_url: { type: String },
  logo: { type: String },
  companyRegistrationNumber: { type: String },
  tradeLicenseNumber: { type: String },
  bankAccountNumber: { type: String },
  bankName: { type: String },
  ifscCode: { type: String },
  social_media_links: [{ type: String }],
  // feedback_rating: { type: Number, default: 0 },
  // verified: { type: Boolean, default: false },
  // verification_documents: [{ type: String }], // URLs to verification documents
  // shipping_methods: [{ type: String }],
  // shipping_addresses: [{ type: String }],
});
const SellerUser = mongoose.model("Selleruser", sellerSchema);
module.exports = SellerUser;
