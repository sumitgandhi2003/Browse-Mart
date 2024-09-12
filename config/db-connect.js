const mongoose = require("mongoose");

const connectDB = async () => {
  if (process.env.NODE_ENV === "production") {
    console.log("Using production database url");
    return;
  }
  console.log("Using development database url");

  try {
    mongoose
      .connect(process.env.DB_URL)
      .then(()=>
        console.log("Database connected..."));
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

module.exports = connectDB;
