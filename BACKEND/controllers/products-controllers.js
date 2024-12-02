const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Product = require('../models/product');
const Brand = require('../models/brand');

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product.',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      'Could not find product for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const getProductsByBrandId = async (req, res, next) => {
  const brandId = req.params.uid;
console.log(brandId)
  // let places;
  let brandWithProducts;
  try {
    brandWithProducts = await Brand.findById(brandId).populate('products');
  } catch (err) {
    const error = new HttpError(
      'Fetching products failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!brandWithProducts || brandWithProducts.products.length === 0) {
    return next(
      new HttpError('Could not find products for the provided brand id.', 404)
    );
  }

  res.json({
    products: brandWithProducts.products.map(product =>
      product.toObject({ getters: true })
    )
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address } = req.body;

  

  const createdProduct = new Product({
    title,
    description,
    address,
    image: req.file.path,
    creator:req.brandData.brandId
  });

  let brand;
  try {
    
    brand = await Brand.findById(req.brandData.brandId);
    console.log("working")
  } catch (err) {
    const error = new HttpError(
      'Creating product failed, please try again.',
      500
    );
    return next(error);
  }

  if (!brand) {

    const error = new HttpError('Could not find brand for provided id.', 404);
    return next(error);
  }

  console.log(brand);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess });
    brand.products.push(createdProduct);
    await brand.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log("notworking")
    const error = new HttpError(
      
      'Creating product failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }

  if(product.creator.toString() !== req.brandData.brandId){
    const error = new HttpError(
      'You are not allowed to edit this product potaeto head',
      401
    );
    return next(error);
  }

  product.title = title;
  product.description = description;
  product.address=address;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError('Could not find product for this id.', 404);
    return next(error);
  }

  if(product.creator.id !== req.brandData.brandId){
    const error = new HttpError(
      'You are not allowed to delete this product potaeto head',
      401
    );
    return next(error);
  }

  const imagePath = product.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.deleteOne({ session: sess });
    product.creator.products.pull(product);
    await product.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted product.' });
};

exports.getProductById = getProductById;
exports.getProductsByBrandId = getProductsByBrandId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
