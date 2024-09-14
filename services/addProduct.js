const Product = require("../model/productSchema");

const addProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;
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
    res.status(201).send("data Saved");
  } catch (error) {
    console.log(error);
  }
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
