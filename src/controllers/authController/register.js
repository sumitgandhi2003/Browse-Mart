const User = require("../../model/userSchema");
const bcrypt = require("bcrypt");
const sendOtpEmail = require("../../services/otpService");
const register = async (req, res) => {
  const { name, email, password, TandC, confirmPassword, phoneNumber } =
    req.body;
  try {
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "You're already registered. Try logging in.",
      });
    if (password !== confirmPassword)
      return res?.status(400)?.json({
        sucess: false,
        message: "both Password and confirm Password must be same",
      });
    const hashedOtp = await sendOtpEmail(email, "Your Registration OTP");
    const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000);
    if (!hashedOtp) {
      return res?.status(500)?.json({
        success: false,
        message: "Something went wrong please try agian later",
      });
    }
    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      password: password, // Hash later after OTP verification
      TandC: TandC || false,
      otp: hashedOtp,
      otpExpireAt,
      phoneNumber: phoneNumber,
    });
    await newUser.save();

    res.status(200).json({
      success: true,
      message:
        "Your OTP has been sent! Kindly check your inbox or spam folder.",
      email,
    });
    // const newUser = new User({
    //   name: name.trim(),
    //   email: email.trim(),
    //   password: password,
    //   TandC: TandC,
    // });
    // await newUser.save();

    // res.status(201).json({
    //   message: "User created successfully",
    //   AuthToken: await newUser.generateToken(),
    // });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object?.keys(error?.keyPattern)[0];
      const value = error?.keyValue[field];
      res.status(400).send(`${field} ${value} already exists.`);
      return;
    }
    console.error(error);
  }
};

module.exports = register;
