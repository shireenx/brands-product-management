const express = require('express');
const { check } = require('express-validator');

const brandsController = require('../controllers/brands-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', brandsController.getBrands);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  brandsController.signup
);

router.post('/login', brandsController.login);

module.exports = router;
