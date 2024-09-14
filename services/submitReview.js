const { response } = require("express");
const Product = require("../model/productSchema");

const submitReview = async (req, res, next) => {
  try {
    const { productId, userId, userName, rating, heading, message } = req.body;
    if (!rating || !heading || !message) {
      return res.status(400).send("All fields are required");
    }
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
      return res.send("review not submitted");
    }
    res.send("Review submitted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = submitReview;
