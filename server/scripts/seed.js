
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');

dotenv.config();

const foods = [
  {
    name: 'Truffle Mushroom Pizza',
    description: 'Fresh wood-fired pizza topped with seasonal mushrooms, mozzarella, and aromatic truffle oil.',
    category: 'Pizza',
    price: 18.99,
    imageURL: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.8
  },
  {
    name: 'Wagyu Beef Burger',
    description: 'Juicy wagyu patty with caramelized onions, swiss cheese, and special sauce on a brioche bun.',
    category: 'Burgers',
    price: 22.50,
    imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'Quinoa Power Bowl',
    description: 'Roasted sweet potato, kale, avocado, chickpeas, and lemon-tahini dressing.',
    category: 'Salads',
    price: 14.00,
    imageURL: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.5
  },
  {
    name: 'Spicy Salmon Sushi Roll',
    description: 'Fresh salmon, cucumber, avocado, topped with spicy mayo and crispy shallots.',
    category: 'Sushi',
    price: 16.50,
    imageURL: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.7
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    await Food.deleteMany();
    await Food.insertMany(foods);
    console.log('Database Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
