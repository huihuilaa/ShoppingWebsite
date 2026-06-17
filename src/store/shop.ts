import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { productAPI, cartAPI, userAPI } from '../api';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
    const cartRef = collection(db, 'carts');
    
    const cartItemData = {
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      imageUrl: product.imageUrl || '',
      selectedSpec: spec || '標準款',
      quantity: quantity,
      checked: true,
      createdAt: new Date().getTime()
    };

    const docRef = await addDoc(cartRef, cartItemData);

    cartItems.value.push({
      id: docRef.id,
      product,
      selectedSpec: spec || '標準款',
      quantity,
      checked: true
    });

  } catch (error) {
    console.error(error);
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