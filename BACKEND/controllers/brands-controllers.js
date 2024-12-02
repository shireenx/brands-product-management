const { validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const HttpError = require('../models/http-error');
const Brand = require('../models/brand');

const getBrands = async (req, res, next) => {
  let brands;
  try {
    brands = await Brand.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching brands failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ brands: brands.map(brand => brand.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password, b_description } = req.body;
  console.log(b_description)
  let existingBrand;
  try {
    existingBrand = await Brand.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingBrand) {
    const error = new HttpError(
      'Brand exists already, please login instead.',
      422
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword=await bcrypt.hash(password,12);
  } catch (err) {
    const error = new HttpError('Could not create user,please try again',500);
    next(error)
  }
  
  const createdBrand = new Brand({
    name,
    email,
    password:hashedPassword,
    image: req.file.path,
    b_description,
    
    products: [],
  });

  try {
    console.log({ name, email, hashedPassword, filePath: req.file?.path, b_description });
    await createdBrand.save();
  } catch (err) {
    
    const error = new HttpError(
      
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token=jwt.sign(
      {brandId:createdBrand.id,email:createdBrand.email},
      process.env.JWT_SECRET,
      {expiresIn:'1h'}
  );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  

  res.status(201).json({ brandId:createdBrand.id,email:createdBrand.email,token:token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingBrand;

  try {
    existingBrand = await Brand.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingBrand) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }
  let isValidPassword=false;
  try {
    isValidPassword=await bcrypt.compare(password,existingBrand.password); 
  } catch (err) {
   const error =new HttpError('Could not log you in, please check your credentials',500);
   return next(error);
  }
  if(!isValidPassword){
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token=jwt.sign(
      {brandId:existingBrand.id,email:existingBrand.email},
      process.env.JWT_SECRET,//private key
      {expiresIn:'1h'}
  );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  

  res.json({
    brandId:existingBrand.id,
    email:existingBrand.email,
    token:token
  });
};

exports.getBrands = getBrands;
exports.signup = signup;
exports.login = login;
