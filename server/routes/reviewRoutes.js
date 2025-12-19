
const express = require('express');
const router = express.Router();
const { getReviewsByFood, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:foodId', getReviewsByFood);
router.post('/', protect, addReview);

module.exports = router;
