const User = require("../../model/userSchema");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  const { email, prev_password, new_password } = req.body;
  try {
    const userExist = await User.findOne({ email: email.trim() });
    if (!userExist) {
      return res.status(404).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(prev_password, userExist?.password);
    if (!isMatch) {
      return res.json({ msg: "previous password is incorrect" });
    }
    userExist.password = new_password;
    await userExist.save();
    return res.status(200).json({ msg: "updated!" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = changePassword;
