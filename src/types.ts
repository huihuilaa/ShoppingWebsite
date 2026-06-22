export interface Product {
  id: string;
  title: string;
  alias: string;
  price: number;
  imageUrl: string;
  isFeatured?: boolean;
  status: 'draft' | 'published' | 'archived';
  specs: string[];
  releaseDate?: string;
  bookingPeriod?: string;
  shippingDate?: string;
  contentDesc?: string;
  sizeMaterial?: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  selectedSpec: string;
  quantity: number;
  checked: boolean;
  createdAt: number;
}

export interface Order {
  id: string;
  status: '運送中' | '已付款' | '已完成';
  totalPrice: number;
  items: {
    title: string;
    spec: string;
    quantity: number;
    price: number;
  }[];
}