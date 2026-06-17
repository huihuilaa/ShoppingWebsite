import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, auth } from '../lib/firebase';
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, where, orderBy
} from 'firebase/firestore';

export const useShopStore = defineStore('shop', () => {
  const isLoggedIn = ref(false);
  const cartItems = ref<any[]>([]);
  const orders = ref<any[]>([]);

  const loadCart = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'carts'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      cartItems.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('載入購物車失敗:', error);
    }
  };

  const addToCart = async (product: any, spec: string, quantity: number) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('請先登入');
      return;
    }
    try {
      const cartItemData = {
        userId: currentUser.uid,
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        imageUrl: product.imageUrl || '',
        selectedSpec: spec || '標準款',
        quantity: quantity,
        checked: true,
        createdAt: new Date().getTime()
      };
      const docRef = await addDoc(collection(db, 'carts'), cartItemData);
      cartItems.value.push({ id: docRef.id, ...cartItemData });
    } catch (error) {
      console.error(error);
      alert('加入購物車失敗');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'carts', id));
      cartItems.value = cartItems.value.filter(item => item.id !== id);
    } catch (error) {
      alert('刪除失敗');
    }
  };

  const fetchUserOrders = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      orders.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('載入訂單失敗:', error);
    }
  };

  return {
    isLoggedIn,
    cartItems,
    orders,
    loadCart,
    addToCart,
    removeFromCart,
    fetchUserOrders,
  };
});