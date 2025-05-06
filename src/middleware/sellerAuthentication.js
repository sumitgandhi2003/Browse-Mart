const sellerAuthentication = (req, res, next) => {
  const foundedUser = req?.user;
  if (foundedUser?.userType !== "seller" || !foundedUser?.sellerId) {
    return res?.status(401)?.json({
      sucess: false,
      message: "You don't access of seller feature kindly resgiser as Seller",
    });
  }
  next();
};

module.exports = sellerAuthentication;
