import Product from "../models/Product.js";
import Variant from "../models/Variant.js";
import ProductGallery from "../models/ProductGallery.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
const products = async (req, res) => {
  const products = await Product.find()
    .where("seller")
    .equals(req.admin._id.toString());
  res.status(200).json({ products });
};

const filteredProducts = async (req, res) => {
  const filter = req.params["filter"];
  const products = await Product.find({
    $or: [
      { name: new RegExp(filter, "i") },
      { category: new RegExp(filter, "i") },
    ],
  }).sort({ createdAt: -1 });
  res.status(200).json({ products });
};

const getImage = async (req, res) => {
  const img = req.params["img"];

  fs.stat("./uploads/products/" + img, function (error) {
    if (error) {
      const imagePath = "./uploads/products/notfound.jpg";
      res.status(200).sendFile(path.resolve(imagePath));
    } else {
      const imagePath = "./uploads/products/" + img;
      res.status(200).sendFile(path.resolve(imagePath));
    }
  });
};

const getGallery = async (req, res) => {
  const img = req.params["img"];

  fs.stat("./uploads/gallery/" + img, function (error) {
    if (error) {
      const imagePath = "./uploads/products/notfound.jpg";
      res.status(200).sendFile(path.resolve(imagePath));
    } else {
      const imagePath = "./uploads/gallery/" + img;
      res.status(200).sendFile(path.resolve(imagePath));
    }
  });
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  //console.log(product)
  //console.log(req.user)
  if (!product) {
    return res.status(404).send({ msg: "Producto no encontrado" });
  }

  if (product.seller.toString() !== req.admin._id.toString()) {
    return res.json({ msg: "Este producto no pertenece a tu stock" });
  }

  res.status(200).json(product);
};

const addProduct = async (req, res) => {
  /*const imgPath = req.files.image.path.split("\\")*/
  // DEPLOY PATH //
  //const imgPath = req.files.image.path.split("/");
  //const imgString = imgPath[2];
  const product = new Product(req.body);

  const slug = slugify(product.name).toLowerCase();
  product.slug = slug;
  product.seller = req.admin._id.toString();

  cloudinary.config({
    cloud_name: "dtz5gvyex",
    api_key: "117716636818335",
    api_secret: "Q3jKmLuxiCVzt2ueGZC-HQFZ54M",
  });
  const file = req.files.image;

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    product.image = cloudinaryResponse.secure_url;
    product.imagePublicID = cloudinaryResponse.public_id;
    //if (updatedCar.imagePublicID !== "") {
    //  await cloudinary.uploader.destroy(product.imagePublicID);
    //}
  } catch (writeError) {
    console.error("Error writing file:", writeError);
    return res.status(500).json({ msg: "ERROR_WRITING_FILE" });
  }

  try {
    const productSaved = await product.save();

    // busca el producto para crear una variante para administrar el stock
    //const product = await product.findOne({ image: product.image });
    //
    //const variant = new Variant({
    //  product: product._id,
    //  provider: "",
    //  variant: "",
    //  skuCode: "",
    //  stock: 0,
    //  onlyVariant: true,
    //  onlyVariantActive: true,
    //});
    //
    //await variant.save();

    // Eliminar archivo temporal del servidor
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
    return res.status(200).send(productSaved);
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }

  if (product.seller.toString() !== req.admin._id.toString()) {
    return res.json({ msg: "Este producto no pertenece a tu stock" });
  }

  try {
    await product.deleteOne();
    return res.status(200).json({ msg: "Producto eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }

  if (product.seller.toString() !== req.admin._id.toString()) {
    return res.json({ msg: "Este producto no pertenece a tu stock" });
  }

  cloudinary.config({
    cloud_name: "dtz5gvyex",
    api_key: "117716636818335",
    api_secret: "Q3jKmLuxiCVzt2ueGZC-HQFZ54M",
  });
  const file = req.files.image;

  if (file) {
    try {
      // Delete previous image
      if (product.imagePublicID !== "") {
        await cloudinary.uploader.destroy(product.imagePublicID);
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
      product.image = cloudinaryResponse.secure_url;
      product.imagePublicID = cloudinaryResponse.public_id;

      // Delete picture from server
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    } catch (writeError) {
      console.error("Error writing file:", writeError);
      return res.status(500).json({ msg: "ERROR_WRITING_FILE" });
    }
  }

  product.name = req.body.name || product.name;
  product.category = req.body.category || product.category;
  product.subcategory = req.body.subcategory || product.subcategory;
  product.description = req.body.description || product.description;
  product.price = req.body.price || product.price;
  if (!file) {
    product.image = req.body.image;
    product.imagePublicID = req.body.imagePublicID;
  }
  product.stock = req.body.stock || product.stock;
  product.forSale = req.body.forSale || product.forSale;
  product.discount = req.body.discount || product.discount;
  product.slug = req.body.slug || product.slug;
  product.str_variant = req.body.str_variant || product.str_variant;

  const slug = slugify(product.name);
  product.slug = slug;

  try {
    const editedProduct = await product.save();
    return res.status(200).json(editedProduct);
  } catch (error) {
    return res.status(200).json(req.files.image);
  }
};

const saveVariant = async (req, res) => {
  const variant = new Variant(req.body);

  // busca si hay variantes creadas para activar las variantes
  const existingVariants = await Variant.find({ product: variant.product });

  try {
    // guarda la variante
    const variantSaved = await variant.save();

    // si se creo una variante por primera vez, cambia product.hasVariant = true
    if (existingVariants.length == 0) {
      await Product.findByIdAndUpdate(
        { _id: variant.product },
        { hasVariant: true, stock: 0 }
      );
    }

    res.status(200).json(variantSaved);
  } catch (error) {
    console.log(error);
  }
};

const getProductVariants = async (req, res) => {
  const { id } = req.params;
  try {
    const variants = await Variant.find({ product: id });
    return res.status(200).json(variants);
  } catch (error) {
    console.log(error);
  }
};

const editVariant = async (req, res) => {
  const editedVariant = req.body;
  try {
    await Variant.findByIdAndUpdate(editedVariant._id, editedVariant);
    return res.status(200);
  } catch {
    return res.status(400).json({ msg: "ERROR_EDITING_VARIANT" });
  }
};

const deleteVariantByStock = async (req, res) => {
  const { id } = req.params;

  try {
    const variant = await Variant.findOneAndRemove({ _id: id });

    // busca si hay variantes creadas para desactivar las variantes
    const existingVariants = await Variant.find({
      product: variant.product,
    });

    // si se eliminó una variante y no hay mas, cambia product.hasVariant = false
    if (existingVariants.length == 0) {
      await Product.findByIdAndUpdate(
        { _id: variant.product },
        { hasVariant: false, stock: 0 }
      );
    }

    return res.status(200).json(variant);
  } catch (error) {
    console.log(error);
  }
};

const addImageInGallery = async (req, res) => {
  /*const imgPath = req.files.image.path.split("\\")*/
  // DEPLOY PATH //

  const image = new ProductGallery(req.body);

  try {
    cloudinary.config({
      cloud_name: "dtz5gvyex",
      api_key: "117716636818335",
      api_secret: "Q3jKmLuxiCVzt2ueGZC-HQFZ54M",
    });
    const file = req.files.image;
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    // Delete file from server storage
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
    image.image = cloudinaryResponse.secure_url;
    image.imagePublicID = cloudinaryResponse.public_id;

    const imageSaved = await image.save();
    return res.status(200).json(imageSaved);
  } catch (error) {
    console.log(error);
  }
};

const getAllGallery = async (req, res) => {
  const { id } = req.params;

  const gallery = await ProductGallery.find({ product: id });
  return res.status(200).json(gallery);
};

const deleteImgFromGallery = async (req, res) => {
  const { id } = req.params;

  try {
    const imgToDelete = await ProductGallery.findById({ _id: id });
    await cloudinary.uploader.destroy(imgToDelete.imagePublicID);
    const imageToDelete = await ProductGallery.deleteOne({ _id: id });
    return res.status(200).json(imageToDelete);
  } catch (error) {
    res.status(404).json({ msg: "No se pudo eliminar la imagen" });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;

  const existCat = await Category.findOne({ name });

  if (existCat) {
    return res.json({ msg: "Esta categoría ya existe" });
  }

  const category = new Category(req.body);
  category.slug = slugify(category.name).toLowerCase();
  try {
    const savedCategory = await category.save();
    return res.status(200).json({ msg: "Categoria creada", savedCategory });
  } catch (error) {
    res.status(404).json({ msg: "No se pudo crear la categoria" });
  }
};

const getAllCategories = async (req, res) => {
  const { name } = req.body;
  try {
    const allCategories = await Category.find().sort({ name: 1 });
    const categories = [];

    for (const item of allCategories) {
      const subcategories = await Subcategory.find({ category: item._id });
      const products = await Product.find({ category: item.name });

      categories.push({
        category: item,
        subcategories,
        qOfProducts: products.length,
      });
    }

    return res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ msg: "No se encontró la categoria" });
  }
};

const createSubcategory = async (req, res) => {
  const { category, name } = req.body;

  const existSubcat = await Subcategory.find({ category: category });
  // comprobacion de subcategoria existente //
  const comp = existSubcat.some((subcat) => {
    return subcat.name == name;
  });

  if (comp) {
    return res.json({ msg: "Esta subcategoría ya existe" });
  }

  const subcategory = new Subcategory(req.body);
  const catName = await Category.findById(category);
  subcategory.categoryName = catName.name;

  try {
    const savedSubcategory = await subcategory.save();
    return res.status(200).json({ savedSubcategory });
  } catch (error) {
    res.status(404).json({ msg: "No se pudo crear la categoria" });
  }
};

const deleteSubcategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subcat = await Subcategory.findByIdAndRemove({ _id: id });
    return res.status(200).json({ subcat });
  } catch (error) {
    res.status(404).json({ msg: "No se pudo eliminar la subcategoria" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const cat = await Category.findByIdAndRemove({ _id: id });
    return res.status(200).json({ cat });
  } catch (error) {
    res.status(404).json({ msg: "No se pudo eliminar la categoria" });
  }
};

export {
  addProduct,
  editProduct,
  deleteProduct,
  products,
  getOneProduct,
  filteredProducts,
  getImage,
  saveVariant,
  getProductVariants,
  deleteVariantByStock,
  addImageInGallery,
  getGallery,
  getAllGallery,
  deleteImgFromGallery,
  createCategory,
  getAllCategories,
  createSubcategory,
  deleteSubcategory,
  deleteCategory,
  editVariant
};
