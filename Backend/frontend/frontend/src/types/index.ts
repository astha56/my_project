export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'restaurant';
  avatar?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  status: 'active' | 'pending' | 'inactive';
  ownerId: string;
  address: string;
  phone: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface Review {
  id: string;
  customerId: string;
  restaurantId: string;
  menuItemId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
}