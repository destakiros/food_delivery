export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  CONFIRMED = 'Confirmed',
  PREPARING = 'Preparing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  location?: Coordinates;
  status: 'Active' | 'Suspended';
  suspensionEnd?: string;
  notifications: Notification[];
  orderHistory?: string[];
}

export interface FoodOption {
  name: string;
  choices: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageURL: string;
  isAvailable: boolean;
  rating: number;
  options?: FoodOption[];
}

export interface CartItem extends FoodItem {
  quantity: number;
  selectedOptions?: Record<string, string>;
  cartId: string;
}

export interface Order {
  id: string;
  customerId: any;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending';
  orderStatus: OrderStatus;
  deliveryAddress: string;
  currentLocation?: Coordinates;
  destinationLocation?: Coordinates;
  instructions?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  menuItemId: string;
  rating: number;
  comment: string;
  adminFeedback?: 'Like' | 'Dislike' | null;
  date: string;
}