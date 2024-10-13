const Product = require("../../model/productSchema");

const addProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;
  // console.log(req.body);
  try {
    const newProduct = new Product({
      name: name,
      price: price,
      description: description,
      image: image,
      category: category,
      stock: stock,
    });
    await newProduct.save();
    console.log("data Saved");
    return res.status(201).json({ message: "data Saved and Uploaded!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product. Please try again later."); // Or a more specific message based on the error
  }
  // return res.json({ message: "product uploaded!" });
};
module.exports = addProduct;
// try {
//     const newProduct = new product.insertOne({

//     });
//     await newProduct.save();
//     res.status(201).json(newProduct);
// } catch (error) {
//     res.status(400).json({message: error.message});
// }
