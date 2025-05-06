const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const userAuthentication = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  const token = (authHeader && authHeader.split(" ")[1]) || "";
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // console.log(decoded, "Hello");

    if (!decoded) {
      return res.status(401).json({ message: "Access denied. Invalid token." });
    }

    const user = await User.findById(decoded?.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // return res.status(200).json({ message: "data found", user });
    req.user = user;
    next();
  } catch (err) {
    console.log(err?.message);
    res.status(401).json({ message: "Token expired" });
  }
};
module.exports = userAuthentication;
