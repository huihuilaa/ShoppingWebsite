import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product, CartItem, Order } from '../types';
import initialProducts from '../data/products.json';

export const useShopStore = defineStore('shop', () => {
  const products = ref<Product[]>(initialProducts as Product[]);
  const cartItems = ref<CartItem[]>([]);
  
  const orders = ref<Order[]>([
    { id: 'CC0001', status: '運送中', totalPrice: 1200, items: [{ title: 'JOJIPPEN', spec: '標準款', quantity: 1, price: 600 }] },
    { id: 'CC0002', status: '已付款', totalPrice: 1850, items: [] },
    { id: 'CC0003', status: '已完成', totalPrice: 930, items: [] }
  ]);

  const shippingFee = ref(150);

  const publishedProducts = computed(() => products.value.filter(p => p.status === 'published'));
  const featuredProducts = computed(() => publishedProducts.value.filter(p => p.isFeatured));
  
  const cartSubtotal = computed(() => {
    return cartItems.value
      .filter(item => item.checked)
      .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });
  
  const cartTotalPrice = computed(() => {
    return cartSubtotal.value > 0 ? cartSubtotal.value + shippingFee.value : 0;
  });

  const totalCartQuantity = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const addToCart = (product: Product, spec: string, quantity: number) => {
    const existingItem = cartItems.value.find(
      item => item.product.id === product.id && item.selectedSpec === spec
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.value.push({
        id: crypto.randomUUID(),
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
    products, cartItems, orders, shippingFee,
    publishedProducts, featuredProducts, cartSubtotal, cartTotalPrice, totalCartQuantity,
    addToCart, removeFromCart
  };
});