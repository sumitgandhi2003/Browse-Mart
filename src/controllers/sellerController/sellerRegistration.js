const SellerUser = require("../../model/sellerUserSchema");
const User = require("../../model/userSchema");
const sellerRegistration = async (req, res) => {
  try {
    const activeUser = req?.user;
    const {
      businessName,
      panNumber,
      gstNumber,
      phoneNumber,
      emailAddress,
      addressLine1,
      city,
      state,
      pinCode,
      country,
      businessType,
      website_url,
      logo,
      companyRegistrationNumber,
      tradeLicenseNumber,
      bankAccountNumber,
      bankName,
      ifscCode,
      social_media_links,
    } = req.body;
    const isExistingSeller = await SellerUser.findOne({
      $or: [
        { userId: activeUser?._id || activeUser?.id },
        { emailAddress: emailAddress },
      ],
    });
    if (isExistingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller with this user ID or email address already exists.",
      });
    }
    // const { name, email, password } = req.body;

    const newSeller = new SellerUser({
      userId: activeUser?._id || activeUser?.id,
      businessName,
      panNumber,
      gstNumber,
      phoneNumber,
      emailAddress,
      addressLine1,
      city,
      state,
      pinCode,
      country,
      businessType,
      website_url,
      logo,
      companyRegistrationNumber,
      tradeLicenseNumber,
      bankAccountNumber,
      bankName,
      ifscCode,
      social_media_links,
    });
    const savedSeller = await newSeller.save();
    const updatedUser = await User.findByIdAndUpdate(
      activeUser?._id || activeUser?.id,
      {
        sellerId: savedSeller?._id || savedSeller?.id,
        userType: "seller",
      },
      { new: true }
    );

    res.status(201).json({
      message: "Seller created successfully",
      seller: savedSeller,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};
module.exports = sellerRegistration;
