import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import initialProducts from '../data/products.json';

export interface Product {
  id: string;
  title: string;
  alias: string;
  price: number;
  imageUrl: string;
  status: 'published' | 'draft';
  specs: string[];
  releaseDate?: string;
  bookingPeriod?: string;
  shippingDate?: string;
  contentDesc?: string;
  sizeMaterial?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSpec: string;
  quantity: number;
  checked: boolean;
}

export interface OrderItem {
  title: string;
  spec: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
}

export const useShopStore = defineStore('shop', () => {
  const isLoggedIn = ref(false);
  const shippingFee = ref(150);

  const products = ref<Product[]>(initialProducts as Product[]);

  const cartItems = ref<CartItem[]>([]);

  const orders = ref<Order[]>([
    { 
      id: 'CC0001', 
      status: '運送中', 
      totalPrice: 1200, 
      items: [
        { title: 'ヒメヒナネックストラップ', spec: '標準款', quantity: 2, price: 350 },
        { title: 'ヒメヒナクリアファイル', spec: '標準款', quantity: 3, price: 120 }
      ] 
    },
    { 
      id: 'CC0002', 
      status: '已付款', 
      totalPrice: 1850, 
      items: [
        { title: 'ヒメヒナアクリルキーホルダー', spec: 'A款', quantity: 1, price: 250 },
        { title: 'ヒメヒナアクリルキーホルダー', spec: 'B款', quantity: 1, price: 250 },
        { title: 'ヒメヒナアクリルキーホルダー', spec: 'C款', quantity: 1, price: 250 },
        { title: '解說の“あれ”アクリルスタンド', spec: '標準款', quantity: 2, price: 400 }
      ] 
    },
    { 
      id: 'CC0003', 
      status: '已完成', 
      totalPrice: 930, 
      items: [
        { title: 'ヒメヒナダイカットステッカーセット', spec: '標準款', quantity: 2, price: 200 },
        { title: 'ヒメヒナネックストラップ', spec: '標準款', quantity: 1, price: 350 }
      ] 
    }
  ]);

  const publishedProducts = computed(() => {
    return products.value.filter(p => p.status === 'published');
  });

  const featuredProducts = computed(() => {
    return products.value.filter(p => p.status === 'published').slice(0, 3);
  });

  const cartSubtotal = computed(() => {
    return cartItems.value
      .filter(item => item.checked)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });

  const cartTotalPrice = computed(() => {
    const hasCheckedItem = cartItems.value.some(item => item.checked);
    if (!hasCheckedItem) return 0;
    return cartSubtotal.value + shippingFee.value;
  });

  const addToCart = (product: Product, spec: string, quantity: number) => {
    const existingItem = cartItems.value.find(
      item => item.product.id === product.id && item.selectedSpec === spec
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.value.push({
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        product,
        selectedSpec: spec,
        quantity,
        checked: true
      });
    }
  };

  const removeFromCart = (id: string) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id);
  };

  return {
    isLoggedIn,
    shippingFee,
    products,
    cartItems,
    orders,
    publishedProducts,
    featuredProducts,
    cartSubtotal,
    cartTotalPrice,
    addToCart,
    removeFromCart
  };
});