import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { productAPI, cartAPI, userAPI } from '../api';

export const useShopStore = defineStore('shop', () => {
  const isLoggedIn = ref(false);
  const products = ref<any[]>([]);
  const cartItems = ref<any[]>([]);
  const orders = ref<any[]>([]);

  const fetchAllProducts = async (page = 1, limit = 12, sortBy = '') => {
    try {
      const res = await productAPI.getProducts(page, limit, sortBy);
      products.value = res.data.products;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserOrders = async (uid: string) => {
    try {
      const res = await userAPI.getOrders(uid);
      orders.value = res.data.orders;
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (product: any, spec: string, quantity: number) => {
    try {
      const res = await cartAPI.addToCart(product.id, spec, quantity);
      cartItems.value.push({
        id: res.data.cartItemId,
        product,
        selectedSpec: spec,
        quantity,
        checked: true
      });
    } catch (error) {
      alert('加入購物車失敗');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await cartAPI.removeFromCart(id);
      cartItems.value = cartItems.value.filter(item => item.id !== id);
    } catch (error) {
      alert('刪除失敗');
    }
  };

  return {
    isLoggedIn,
    products,
    cartItems,
    orders,
    fetchAllProducts,
    fetchUserOrders,
    addToCart,
    removeFromCart
  };
});