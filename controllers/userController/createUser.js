const User = require("../../model/userSchema");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
  const { name, email, password, TandC } = req.body;
  try {
    if (!name || !email || !password || !TandC) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      password: password,
      TandC: TandC,
      isSeller: false,
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      AuthToken: await newUser.generateToken(),
    });
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

module.exports = createUser;
