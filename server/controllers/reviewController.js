
const Review = require('../models/Review');

exports.getReviewsByFood = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItemId: req.params.foodId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { menuItemId, rating, comment } = req.body;
    const review = new Review({
      userId: req.user._id,
      userName: req.user.name,
      menuItemId,
      rating,
      comment
    });
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
