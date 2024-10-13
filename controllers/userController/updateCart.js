const User = require("../../model/userSchema");

const updateCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const foundedUser = await req.user;
  const item = foundedUser.cart.find(
    (item) => item.productId.toString() === productId.toString()
  );
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  if (quantity === 0) {
    foundedUser.cart = foundedUser.cart.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
  } else {
    item.quantity = quantity;
  }
  await foundedUser.save();

  res.json({ message: "Hello" });
};
module.exports = updateCart;
