const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  mrpPrice: { type: Number, required: false, default: null },
  sellingPrice: { type: Number, required: false, default: null },
  description: { type: String, required: true },
  image: [],
  category: { type: String, required: true },
  subCategory: { type: String, required: false },
  brand: { type: String, required: false },
  stock: { type: Number, required: false },
  inStock: { type: Boolean, required: false },
  isHide: { type: Boolean, required: false, default: false },
  review: [
    {
      rating: { type: Number, required: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "SellerUser" },
  // productId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   unique: true,
  //   index: true,
  //   auto: true,
  //   default: mongoose.Types.ObjectId(),
  // },
  // _id: false,
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
