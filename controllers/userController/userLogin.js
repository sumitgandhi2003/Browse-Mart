const User = require("../../model/userSchema");
const bcrypt = require("bcrypt");

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email and password
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email: email.trim() });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // Check if password is correct
    const validPassword = await existingUser.passwordCompare(password);
    console.log(validPassword);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid Credentials" });
    return res.status(200).json({
      message: "User logged in successfully",
      AuthToken: existingUser.generateToken(),
    });
  } catch (err) {
    console.log(err);
  }
  // Create and sign JWT token
  // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // res.json({ token: token });
};
module.exports = userLogin;
