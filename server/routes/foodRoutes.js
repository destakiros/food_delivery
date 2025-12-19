
const express = require('express');
const router = express.Router();
const { getFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { protect, admin } = require('../middleware/auth');
const { validateFoodItem } = require('../middleware/validate');

router.route('/')
  .get(getFoods)
  .post(protect, admin, validateFoodItem, createFood);

router.route('/:id')
  .get(getFoodById)
  .put(protect, admin, updateFood)
  .delete(protect, admin, deleteFood);

module.exports = router;
