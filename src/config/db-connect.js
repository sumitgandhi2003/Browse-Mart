const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const NODE_ENV = process.env.NODE_ENV;
const connectDB = async (count = 0) => {
  if (count === 10) return;
  if (NODE_ENV === "production") {
    console.log(`using ${NODE_ENV} database URL`);
  } else {
    console.log(`using ${NODE_ENV} database URL`);
  }
  mongoose
    .connect(`${DB_URL}/${DB_NAME}`)
    .then(() => console.log("Database connected..."))
    .catch((error) => {
      console.log(error.message);
      // connectDB(count + 1);
    });
};

module.exports = connectDB;
