
const validateUserRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  next();
};

const validateFoodItem = (req, res, next) => {
  const { name, description, category, price, imageURL } = req.body;
  if (!name || !description || !category || !price || !imageURL) {
    res.status(400);
    throw new Error('Please provide all required food fields');
  }
  next();
};

module.exports = { validateUserRegistration, validateFoodItem };
