
const mongoose = require('mongoose');

const foodOptionSchema = mongoose.Schema({
  name: { type: String, required: true },
  choices: [{ type: String, required: true }]
}, { _id: false });

const foodSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageURL: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  options: [foodOptionSchema]
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
