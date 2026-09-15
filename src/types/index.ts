export interface User {
  id: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'CLIENT';
  client_type?: 'NORMAL' | 'RETAILER';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  first_name: string;
  last_name: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  business?: {
    name: string;
    gst_number: string;
    address: string;
    license_info?: string;
  };
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  brand: string;
  description: string;
  short_description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  prescription_required: boolean;
  stock_quantity: number;
  status: string;
  featured: boolean;
  best_seller: boolean;
  composition?: string;
  manufacturer?: string;
  dosage?: string;
  usage?: string;
  warnings?: string;
  storage?: string;
  expiry_info?: string;
  average_rating?: number;
  review_count?: number;
  related_products?: Product[];
  category?: Category;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: string;
  subcategories?: Category[];
  product_count?: number;
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  quantity: number;
  thumbnail: string;
  prescription_required: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  items: CartItem[];
  status: string;
  shipping_address: Address;
  created_at: string;
  history?: OrderHistory[];
  customer?: { name: string; email: string; phone: string };
}

export interface OrderHistory {
  status: string;
  note: string;
  created_at: string;
}

export interface Address {
  id?: string;
  full_name: string;
  phone: string;
  gst_number?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string;
  product_name?: string;
  rating: number;
  review_text: string;
  verified_purchase: boolean;
  visible: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string;
  read: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  per_page?: number;
}

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_customers: number;
  normal_customers: number;
  retailers: number;
  total_products: number;
  low_stock_products: number;
  revenue: number;
}
