const { response } = require("express");
const Product = require("../../model/productSchema");

const submitReview = async (req, res, next) => {
  try {
    const { productId, userId, userName, rating, heading, message } = req.body;
    if (!rating || !heading || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(userName, userId);
    const review = await Product.updateOne(
      { _id: productId },
      {
        $push: {
          review: {
            rating: rating,
            heading: heading,
            message: message,
            userid: userId,
            username: userName,
            timestamp: new Date()
              .toLocaleDateString("en-GB")
              .replace("///g", "-"),
          },
        },
      }
    );
    console.log(review);
    if (!review.modifiedCount) {
      return res.json({ message: "review not submitted" });
    }
    res.json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = submitReview;
