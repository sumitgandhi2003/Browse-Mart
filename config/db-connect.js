const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
const connectDB = async () => {
  if (process.env.NODE_ENV === "production") {
    console.log("Using production database url");
    return;
  }
  console.log("Using development database url");
  mongoose
    .connect(DB_URL)
    .then(() => console.log("Database connected..."))
    .catch((error) => {
      console.log(error.message);
    });
};

module.exports = connectDB;
