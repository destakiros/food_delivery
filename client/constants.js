
export const MOCK_FOODS = [
  {
    id: '1',
    name: 'Double-Double',
    description: 'Two 100% pure beef patties, two slices of American cheese, onions, lettuce, and tomato. A classic freshly made in Addis.',
    category: 'Burgers',
    price: 550.00,
    imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '8-12 min',
    calories: 670,
    options: [
      { name: 'Spicy Level', choices: ['Mild', 'Medium', 'Hot'], priceModifiers: { 'Hot': 20 } },
      { name: 'Extra Cheese', choices: ['No', 'Yes'], priceModifiers: { 'Yes': 50 } }
    ]
  },
  {
    id: '2',
    name: 'Animal Style Fries',
    description: 'Hand-cut potatoes topped with melted cheese, secret spread, and perfectly grilled local onions.',
    category: 'Sides',
    price: 380.00,
    imageURL: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '5-7 min',
    calories: 750,
    isSecretMenu: true,
    options: [
      { name: 'Extra Spread', choices: ['No', 'Yes'], priceModifiers: { 'Yes': 30 } }
    ]
  },
  {
    id: '16',
    name: 'Gomen Beef Burger',
    description: 'A local Addis masterpiece. Beef patty topped with sautéed collard greens and spiced Ethiopian butter.',
    category: 'Burgers',
    price: 695.00,
    imageURL: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 5.0,
    prepTime: '10-15 min',
    calories: 720,
    options: [
      { name: 'Gomen Portions', choices: ['Regular', 'Extra'], priceModifiers: { 'Extra': 60 } }
    ]
  },
  {
    id: '17',
    name: 'Piazza Grilled Chicken',
    description: 'Tender chicken breast marinated in herbs, grilled over open flame, served with garlic aioll and fresh Addis arugula.',
    category: 'Burgers',
    price: 625.00,
    imageURL: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.8,
    prepTime: '12-18 min',
    calories: 540
  },
  {
    id: '30',
    name: 'Bole Beef Pizza',
    description: '12-inch hand-tossed dough topped with spiced local beef, green peppers, onions, and melted mozzarella.',
    category: 'Sides',
    price: 850.00,
    imageURL: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.7,
    prepTime: '15-20 min',
    calories: 1100
  },
  {
    id: '31',
    name: 'Arat Kilo Veggie Platter',
    description: 'Roasted seasonal vegetables, chickpea hummus, and multi-grain flatbread. A healthy choice for the neighborhood.',
    category: 'Sides',
    price: 420.00,
    imageURL: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.6,
    prepTime: '10-12 min',
    calories: 480
  },
  {
    id: '32',
    name: 'Meskel Square Mega Club',
    description: 'Triple-decker sandwich with grilled chicken breast, fried egg, fresh tomatoes, and our signature Addis sauce.',
    category: 'Burgers',
    price: 580.00,
    imageURL: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.9,
    prepTime: '12-15 min',
    calories: 890
  },
  {
    id: '18',
    name: 'Habesha Awaze Wings',
    description: '8 pieces of crispy wings tossed in our signature Awaze-infused buffalo sauce. Served with a side of cool yogurt dip.',
    category: 'Sides',
    price: 450.00,
    imageURL: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.9,
    prepTime: '10-12 min',
    calories: 610
  },
  {
    id: '22',
    name: 'Bole Blue Lemonade',
    description: 'Signature lemonade with an exotic blue infusion and crushed local berries. Refreshingly vibrant for Addis afternoons.',
    category: 'Drinks',
    price: 180.00,
    imageURL: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.7,
    prepTime: '3-5 min',
    calories: 180
  },
  {
    id: '21',
    name: 'Addis Espresso Shake',
    description: 'Vanilla dairy cream blended with a double shot of premium Ethiopian Arabica espresso.',
    category: 'Shakes',
    price: 320.00,
    imageURL: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.9,
    prepTime: '4-6 min',
    calories: 520
  }
];

export const CATEGORIES = ['All', 'Burgers', 'Sides', 'Shakes', 'Drinks'];
export const MIN_ORDER_VALUE = 100;
export const OPENING_HOUR = 10; // 10 AM
export const CLOSING_HOUR = 22; // 10 PM
