
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');

dotenv.config();

const foods = [
  {
    name: 'Double-Double',
    description: 'Two 100% pure American beef patties, two slices of American cheese, onions, lettuce, and tomato. Prepared fresh in our Addis kitchen.',
    category: 'Burgers',
    price: 5.85,
    imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'Animal Style Fries',
    description: 'Hand-cut potatoes topped with melted cheese, our signature secret spread, and perfectly grilled onions.',
    category: 'Sides',
    price: 4.80,
    imageURL: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'Neapolitan Shake',
    description: 'Triple-layered blend of Chocolate, Vanilla, and Strawberry real dairy ice cream.',
    category: 'Shakes',
    price: 3.25,
    imageURL: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'Gomen Beef Burger',
    description: 'A local Addis masterpiece. 100% beef patty topped with sautéed Gomen (collard greens), spiced butter, and melted provolone.',
    category: 'Burgers',
    price: 6.95,
    imageURL: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 5.0
  },
  {
    name: 'Piazza Grilled Chicken',
    description: 'Tender chicken breast marinated in herbs, grilled over open flame, served with garlic aioll and fresh Addis arugula.',
    category: 'Burgers',
    price: 6.25,
    imageURL: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.8
  },
  {
    name: 'Habesha Spice Wings',
    description: '8 pieces of crispy wings tossed in a signature Awaze-infused buffalo sauce. Served with a side of cool yogurt dip.',
    category: 'Sides',
    price: 8.50,
    imageURL: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'Ethiopian Coffee Shake',
    description: 'Creamy vanilla ice cream blended with a double shot of premium slow-roasted Ethiopian Arabica espresso.',
    category: 'Shakes',
    price: 3.95,
    imageURL: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'Bole Blue Lemonade',
    description: 'Our signature lemonade with an exotic blue infusion and crushed local berries. Refreshingly vibrant.',
    category: 'Drinks',
    price: 3.25,
    imageURL: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.7
  },
  {
    name: 'Mango-Passion Cooler',
    description: 'Fresh mango pulp blended with passion fruit seeds and sparkling water. Tropical bliss.',
    category: 'Drinks',
    price: 3.50,
    imageURL: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1000',
    isAvailable: true,
    rating: 4.8
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    await Food.deleteMany();
    await Food.insertMany(foods);
    console.log('Database Seeded Successfully with ' + foods.length + ' items.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
