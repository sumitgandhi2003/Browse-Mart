const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  TandC: { type: Boolean },
  isSeller: { type: Boolean },
  // cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  // order: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  phoneNumber: { type: String },
  address: { type: String },
  profilePic: { type: String },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      _id: false,
    },
  ],
  wishlist: [],
  order: [],
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      name: this.name,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1w" }
  );
  return token;
};
userSchema.methods.passwordCompare = async function (plainPassword) {
  const user = this;
  return bcrypt.compare(plainPassword, user.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
