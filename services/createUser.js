const User = require("../model/userSchema");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      // isseller: false,
    });
    await newUser.save();
    res.status(200).send("User created successfully");
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
