const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'Brand' }
});

module.exports = mongoose.model('Product', productSchema);
