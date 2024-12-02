const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  b_description:{type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Product' }]
});

brandSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Brand', brandSchema);
