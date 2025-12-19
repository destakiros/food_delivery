
import { FoodItem } from './types';

export interface DetailedFoodItem extends FoodItem {
  prepTime: string;
  calories: number;
  isSecretMenu?: boolean;
}

export const MOCK_FOODS: DetailedFoodItem[] = [
  {
    id: '1',
    name: 'Double-Double',
    description: 'Two 100% pure American beef patties, two slices of American cheese, onions, lettuce, and tomato. Prepared fresh in our Addis kitchen.',
    category: 'Burgers',
    price: 5.85,
    imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '8-12 min',
    calories: 670,
    options: [
      { name: 'Size', choices: ['Standard', 'Double-Up', 'The Feast'], priceModifiers: { 'Double-Up': 2.50, 'The Feast': 4.50 } },
      { name: 'Onions', choices: ['With Onions', 'No Onions', 'Grilled Onions', 'Whole Grilled Onion'] },
      { name: 'Bun Type', choices: ['Classic Sponge', 'Toasted Brioche', 'Protein Style (Lettuce)'] }
    ]
  },
  {
    id: '21',
    name: 'Ethiopian Coffee Shake',
    description: 'Creamy vanilla ice cream blended with a double shot of premium slow-roasted Ethiopian Arabica espresso.',
    category: 'Shakes',
    price: 3.95,
    imageURL: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '4-6 min',
    calories: 520,
    options: [
      { name: 'Size', choices: ['Small', 'Medium', 'Large'], priceModifiers: { 'Medium': 1.25, 'Large': 2.50 } },
      { name: 'Intensity', choices: ['Standard', 'Triple Shot Boost'], priceModifiers: { 'Triple Shot Boost': 0.75 } }
    ]
  },
  {
    id: '22',
    name: 'Bole Blue Lemonade',
    description: 'Our signature lemonade with an exotic blue infusion and crushed local berries. Refreshingly vibrant.',
    category: 'Drinks',
    price: 3.25,
    imageURL: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.7,
    prepTime: '3-5 min',
    calories: 180,
    options: [
      { name: 'Size', choices: ['Regular', 'Large', 'Bucket'], priceModifiers: { 'Large': 1.00, 'Bucket': 2.50 } },
      { name: 'Garnish', choices: ['Fresh Mint', 'Lemon Slice', 'None'] }
    ]
  },
  {
    id: '16',
    name: 'Gomen Beef Burger',
    description: 'A local Addis masterpiece. 100% beef patty topped with sautéed Gomen (collard greens), spiced butter, and melted provolone.',
    category: 'Burgers',
    price: 6.95,
    imageURL: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 5.0,
    prepTime: '10-15 min',
    calories: 720,
    options: [
      { name: 'Size', choices: ['Standard', 'Large'], priceModifiers: { 'Large': 3.00 } },
      { name: 'Spice Level', choices: ['Mild', 'Mitmita Heat', 'Extra Spicy'] }
    ]
  },
  {
    id: '17',
    name: 'Piazza Grilled Chicken',
    description: 'Tender chicken breast marinated in herbs, grilled over open flame, served with garlic aioll and fresh Addis arugula.',
    category: 'Burgers',
    price: 6.25,
    imageURL: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.8,
    prepTime: '12-18 min',
    calories: 540
  },
  {
    id: '18',
    name: 'Habesha Spice Wings',
    description: '8 pieces of crispy wings tossed in a signature Awaze-infused buffalo sauce. Served with a side of cool yogurt dip.',
    category: 'Sides',
    price: 8.50,
    imageURL: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '15-20 min',
    calories: 890,
    options: [
      { name: 'Portion', choices: ['8 Pieces', '12 Pieces', '20 Pieces'], priceModifiers: { '12 Pieces': 4.00, '20 Pieces': 10.00 } }
    ]
  },
  {
    id: '23',
    name: 'Mango-Passion Cooler',
    description: 'Fresh mango pulp blended with passion fruit seeds and sparkling water. Tropical bliss.',
    category: 'Drinks',
    price: 3.50,
    imageURL: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.8,
    prepTime: '4-6 min',
    calories: 210,
    options: [
      { name: 'Size', choices: ['Regular', 'Large'], priceModifiers: { 'Large': 1.50 } }
    ]
  },
  {
    id: '24',
    name: 'Lava Cheese Fries',
    description: 'Golden fries smothered in Mitmita-infused melted cheese and topped with spicy jalapeño rounds.',
    category: 'Sides',
    price: 5.25,
    imageURL: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '7-10 min',
    calories: 780,
    options: [
      { name: 'Portion', choices: ['Regular', 'Large'], priceModifiers: { 'Large': 2.00 } },
      { name: 'Cheese Level', choices: ['Extra Lava', 'Standard', 'Light'], priceModifiers: { 'Extra Lava': 1.00 } }
    ]
  },
  {
    id: '25',
    name: 'Garden Veggie Wrap',
    description: 'For our plant-based elite. Grilled seasonal veggies, hummus, and tahini in a fresh whole-wheat wrap.',
    category: 'Burgers',
    price: 5.50,
    imageURL: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.6,
    prepTime: '10-12 min',
    calories: 420
  },
  {
    id: '2',
    name: 'Animal Style Fries',
    description: 'Hand-cut potatoes topped with melted cheese, our signature secret spread, and perfectly grilled onions.',
    category: 'Sides',
    price: 4.80,
    imageURL: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '5-7 min',
    calories: 750,
    isSecretMenu: true,
    options: [
      { name: 'Portion', choices: ['Regular', 'Large'], priceModifiers: { 'Large': 2.20 } }
    ]
  },
  {
    id: '13',
    name: 'Chili Cheese Fries',
    description: 'Golden hand-cut fries smothered in house-made spicy beef chili and a blend of melted premium cheeses.',
    category: 'Sides',
    price: 5.50,
    imageURL: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=800&h=600&auto=format',
    isAvailable: true,
    rating: 4.7,
    prepTime: '6-8 min',
    calories: 820
  },
  {
    id: '14',
    name: 'The Flying Dutchman',
    description: 'Two beef patties and two slices of cheese. No bun, no lettuce, just pure protein. A secret menu favorite in Bole.',
    category: 'Burgers',
    price: 5.20,
    imageURL: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 5.0,
    prepTime: '5-7 min',
    calories: 380,
    isSecretMenu: true
  },
  {
    id: '12',
    name: 'Root Beer Float',
    description: 'Nostalgic secret menu masterpiece. Barq’s Root Beer over real dairy vanilla ice cream.',
    category: 'Drinks',
    price: 3.75,
    imageURL: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '4-6 min',
    calories: 420,
    isSecretMenu: true
  },
  {
    id: '9',
    name: 'Hand-Squeezed Lemonade',
    description: 'Fresh lemons pressed daily and sweetened with pure cane sugar. Crisp refreshment for the Addis heat.',
    category: 'Drinks',
    price: 2.50,
    imageURL: 'https://images.unsplash.com/photo-1523472721958-978152f4d69b?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '2-3 min',
    calories: 160,
    options: [
      { name: 'Size', choices: ['Small', 'Medium', 'Large'], priceModifiers: { 'Medium': 0.75, 'Large': 1.50 } }
    ]
  },
  {
    id: '15',
    name: 'Black & White Shake',
    description: 'A dual-flavor blend of rich Chocolate and Vanilla real dairy ice cream.',
    category: 'Shakes',
    price: 3.50,
    imageURL: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '3-5 min',
    calories: 610,
    isSecretMenu: true,
    options: [
      { name: 'Size', choices: ['Small', 'Medium', 'Large'], priceModifiers: { 'Medium': 1.25, 'Large': 2.50 } }
    ]
  },
  {
    id: '11',
    name: 'Classic Coca-Cola',
    description: 'The world classic served over our signature crushed ice.',
    category: 'Drinks',
    price: 2.10,
    imageURL: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '1 min',
    calories: 140,
    options: [
      { name: 'Size', choices: ['Small', 'Medium', 'Large'], priceModifiers: { 'Medium': 0.50, 'Large': 1.00 } }
    ]
  },
  {
    id: '4',
    name: 'Neapolitan Shake',
    description: 'Triple-layered blend of Chocolate, Vanilla, and Strawberry real dairy ice cream.',
    category: 'Shakes',
    price: 3.25,
    imageURL: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.9,
    prepTime: '3-5 min',
    calories: 590,
    isSecretMenu: true,
    options: [
      { name: 'Size', choices: ['Small', 'Medium', 'Large'], priceModifiers: { 'Medium': 1.25, 'Large': 2.50 } }
    ]
  },
  {
    id: '8',
    name: 'Hand-Cut French Fries',
    description: 'Fresh, never frozen, hand-cut potatoes prepared in 100% vegetable oil.',
    category: 'Sides',
    price: 2.30,
    imageURL: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=800&h=600',
    isAvailable: true,
    rating: 4.6,
    prepTime: '5-7 min',
    calories: 395,
    options: [
      { name: 'Size', choices: ['Regular', 'Large'], priceModifiers: { 'Large': 1.50 } }
    ]
  }
];

export const CATEGORIES = ['All', 'Burgers', 'Sides', 'Shakes', 'Drinks'];
