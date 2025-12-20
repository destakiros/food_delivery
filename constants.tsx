
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
    description: 'Two 100% pure American beef patties, two slices of American cheese, onions, lettuce, and tomato.',
    category: 'Burgers',
    price: 5.85,
    imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '8-12 min',
    calories: 670,
  },
  {
    id: '2',
    name: 'Animal Style Fries',
    description: 'Hand-cut potatoes topped with melted cheese, secret spread, and grilled onions.',
    category: 'Sides',
    price: 4.80,
    imageURL: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '5-7 min',
    calories: 750,
    isSecretMenu: true,
  },
  {
    id: '4',
    name: 'Neapolitan Shake',
    description: 'Triple-layered blend of Chocolate, Vanilla, and Strawberry dairy ice cream.',
    category: 'Shakes',
    price: 3.25,
    imageURL: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '3-5 min',
    calories: 590,
    isSecretMenu: true,
  },
  {
    id: '8',
    name: 'Classic French Fries',
    description: 'Fresh, never frozen, hand-cut potatoes prepared in vegetable oil.',
    category: 'Sides',
    price: 2.30,
    imageURL: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.6,
    prepTime: '5-7 min',
    calories: 395,
  },
  {
    id: '16',
    name: 'Gomen Beef Burger',
    description: 'Beef patty topped with sautéed collard greens and spiced butter.',
    category: 'Burgers',
    price: 6.95,
    imageURL: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 5.0,
    prepTime: '10-15 min',
    calories: 720,
  },
  {
    id: '17',
    name: 'Grilled Chicken Burger',
    description: 'Tender breast marinated in herbs, grilled over open flame.',
    category: 'Burgers',
    price: 6.25,
    imageURL: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.8,
    prepTime: '12-18 min',
    calories: 540
  },
  {
    id: '21',
    name: 'Ethiopian Coffee Shake',
    description: 'Vanilla ice cream blended with premium Addis Arabica espresso.',
    category: 'Shakes',
    price: 3.95,
    imageURL: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '4-6 min',
    calories: 520,
  },
  {
    id: '22',
    name: 'Blue Lemonade',
    description: 'Signature lemonade with an exotic blue infusion and crushed berries.',
    category: 'Drinks',
    price: 3.25,
    imageURL: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.7,
    prepTime: '3-5 min',
    calories: 180,
  },
  {
    id: '23',
    name: 'Mango-Passion Cooler',
    description: 'Fresh mango pulp blended with passion fruit seeds and sparkling water.',
    category: 'Drinks',
    price: 3.50,
    imageURL: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.8,
    prepTime: '4-6 min',
    calories: 210,
  },
  {
    id: '24',
    name: 'Lava Cheese Fries',
    description: 'Golden fries smothered in melted cheese and spicy jalapeño rounds.',
    category: 'Sides',
    price: 5.25,
    imageURL: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '7-10 min',
    calories: 780,
  },
  {
    id: '25',
    name: 'Garden Veggie Wrap',
    description: 'Grilled seasonal veggies, hummus, and tahini in a whole-wheat wrap.',
    category: 'Burgers',
    price: 5.50,
    imageURL: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.6,
    prepTime: '10-12 min',
    calories: 420
  }
];

export const CATEGORIES = ['All', 'Burgers', 'Sides', 'Shakes', 'Drinks'];
export const ITEMS_PER_PAGE = 12;
export const DEMO_MODE = true;
export const DEMO_ADMIN_EMAIL = 'admin@gmail.com';
export const DEMO_ADMIN_PASSWORD = 'admin123';
export const DEMO_CUSTOMER_EMAIL = 'customer@example.com';
export const DEMO_CUSTOMER_PASSWORD = 'CustomerPass123!';
