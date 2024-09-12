const { response } = require("express");
const Product = require("../model/productSchema");

const submitReview = async (req, res, next) => {
  try {
    const { productId, userId, rating, headline, description } = req.body;
    if (!productId || !userId || !rating || !headline || !description) {
      return res.status(400).send("All fields are required");
    }
    const review = await Product.updateOne(
      { _id: productId },
      {
        $push: {
          review: {
            rating: rating,
            heading: headline,
            reviewdesc: description,
            userid: userId,
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
