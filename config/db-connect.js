const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
const NODE_ENV = process.env.NODE_ENV;
const connectDB = async () => {
  if (NODE_ENV === "production") {
    console.log(`using ${NODE_ENV} database URL`);
  } else {
    console.log(`using ${NODE_ENV} database URL`);
  }
  mongoose
    .connect(DB_URL)
    .then(() => console.log("Database connected..."))
    .catch((error) => {
      console.log(error.message);
    });
};

module.exports = connectDB;
