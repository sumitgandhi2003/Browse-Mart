const Product = require("../model/productSchema");

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 1000,
      description:
        "our perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      category: "men's clothing",
      stock: 1000,
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
