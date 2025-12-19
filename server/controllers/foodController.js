
const Food = require('../models/Food');

exports.getFoods = async (req, res) => {
  const foods = await Food.find({});
  res.json(foods);
};

exports.getFoodById = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (food) {
    res.json(food);
  } else {
    res.status(404);
    throw new Error('Food item not found');
  }
};

exports.createFood = async (req, res) => {
  const food = new Food(req.body);
  const createdFood = await food.save();
  res.status(201).json(createdFood);
};

exports.updateFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (food) {
    Object.assign(food, req.body);
    const updatedFood = await food.save();
    res.json(updatedFood);
  } else {
    res.status(404);
    throw new Error('Food item not found');
  }
};

exports.deleteFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (food) {
    await food.deleteOne();
    res.json({ message: 'Food item removed' });
  } else {
    res.status(404);
    throw new Error('Food item not found');
  }
};
