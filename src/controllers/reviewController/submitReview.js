import Product from "../../model/productSchema.js";
const submitReview = async (req, res, next) => {
  try {
    const { _id, name } = await req.user;
    const { productId, userId, userName, rating, title, message } = req.body;
    if (!rating || !title || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const review = await Product.updateOne(
      { _id: productId },
      {
        $push: {
          review: {
            rating: Number(rating),
            title: title,
            message: message,
            userId: _id,
            userName: name,
            // timestamp: new Date()
            //   .toLocaleDateString("en-GB")
            //   .replace("///g", "-"),
          },
        },
      }
    );
    if (!review.modifiedCount) {
      return res.json({ message: "review not submitted" });
    }
    res.json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export default submitReview;
