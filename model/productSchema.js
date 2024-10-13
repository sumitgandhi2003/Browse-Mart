const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: [],
  category: { type: String, required: true },
  stock: { type: Number, required: false },
  inStock: { type: Boolean, required: false },
  review: [],
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// productSchema.method.generateToken = function () {
//   console.log(this);
//   const token = jwt.sign(
//     { id: this._id, email: this.email, name: this.name },
//     process.env.JWT_SECRET_KEY
//   );
//   return token;
// };
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
