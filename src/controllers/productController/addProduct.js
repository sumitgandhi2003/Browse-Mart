const Product = require("../../model/productSchema");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      sellingPrice,
      mrpPrice,
      description,
      image,
      category,
      stock,
      brand,
      subCategory,
    } = req.body;
    const foundedUser = req.user;
    if (foundedUser?.userType !== "seller") {
      return res.status(401).json({
        success: false,
        messsage: "unauthorize access you don't have seller account",
      });
    }
    if (
      !name ||
      !mrpPrice ||
      !sellingPrice ||
      !description ||
      !image ||
      !category ||
      !stock ||
      !brand
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const newProduct = new Product({
      name: name,
      mrpPrice: mrpPrice,
      description: description,
      image: image,
      category: category,
      stock: stock,
      // userID: foundedUser?._id,
      sellerId: foundedUser?.sellerId,
      brand: brand,
      subCategory: subCategory,
      sellingPrice,
    });
    await newProduct.save();
    console.log("data Saved");
    return res.status(201).json({
      success: true,
      message: "data Saved and Uploaded!",
    });
  } catch (error) {
    console.error(error);
    res?.status(500)?.json({
      success: false,
      message: "Error in uploading product, Please try again later.",
    }); // Or a more specific message based on the error
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
