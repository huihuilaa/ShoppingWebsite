import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAllProductsService } from '../api/products';
import { getUserOrdersService, createOrderService } from '../api/orders';
import { getCartItemsService, addCartItemService, removeCartItemService, updateCartItemService } from '../api/cart';
import type { Product } from '../types';

export const useShopStore = defineStore('shop', () => {
  const isLoggedIn = ref(false);
  const products = ref<Product[]>([]);
  const cartItems = ref<any[]>([]);
  const orders = ref<any[]>([]);
  const cartLoaded = ref(false);
  const userProfile = ref<{ name: string; phone: string; address: string } | null>(null);

  const fetchProducts = async () => {
    try {
      products.value = await getAllProductsService() as Product[];
    } catch (error) {
      console.error('取得商品失敗:', error);
    }
  };

  const loadCart = async (force = false) => {
    if (cartLoaded.value && !force) return;
    try {
      const data = await getCartItemsService();
      cartItems.value = data;
      cartLoaded.value = true;
    } catch (error) {
      console.error('載入購物車失敗:', error);
    }
  };

  const addToCart = async (product: Product, spec: string, quantity: number) => {
    const user = auth.currentUser;
    if (!user) {
      alert('請先登入！');
      return;
    }

    const existingItem = cartItems.value.find(item => item.productId === product.id && item.selectedSpec === spec);

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      await updateCartItemService(existingItem.id, { quantity: newQty });
      existingItem.quantity = newQty;
    } else {
      const cartItemData = {
        userId: user.uid,
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        imageUrl: product.imageUrl || '',
        selectedSpec: spec || '標準款',
        quantity,
        checked: true,
        createdAt: new Date().getTime()
      };
      const newId = await addCartItemService(cartItemData);
      cartItems.value.push({ id: newId, ...cartItemData });
    }
    alert('已加入購物車！');
  };

  const updateCartQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    try {
      await updateCartItemService(id, { quantity });
      const item = cartItems.value.find(i => i.id === id);
      if (item) item.quantity = quantity;
    } catch (error) {
      console.error('更新數量失敗:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await removeCartItemService(id);
      cartItems.value = cartItems.value.filter(item => item.id !== id);
    } catch (error) {
      console.error('移除失敗:', error);
    }
  };

  const fetchUserProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.name && data.phone && data.address) {
          userProfile.value = { name: data.name, phone: data.phone, address: data.address };
          return userProfile.value;
        }
      }
      userProfile.value = null;
      return null;
    } catch (error) {
      console.error('調用個人資訊失敗:', error);
      return null;
    }
  };

  const checkout = async (customerInfo: { name: string; phone: string; address: string }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const checkedItems = cartItems.value.filter(item => item.checked);
    if (checkedItems.length === 0) return false;

    try {
      const subtotal = checkedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
      const shippingFee = 50;
      const totalPrice = subtotal + shippingFee;

      const randomOrderId = Math.floor(100000 + Math.random() * 900000).toString();

      const orderData = {
        userId: currentUser.uid,
        status: '已付款',
        totalPrice: totalPrice,
        customerInfo,
        items: checkedItems.map(item => ({
          title: item.title,
          spec: item.selectedSpec || '標準款',
          quantity: Number(item.quantity),
          price: Number(item.price)
        })),
        createdAt: new Date().getTime()
      };

      const orderId = await createOrderService(orderData, randomOrderId);

      for (const item of checkedItems) {
        await removeCartItemService(item.id);
      }

      cartItems.value = cartItems.value.filter(item => !item.checked);
      
      return orderId;
    } catch (error) {
      console.error('建立訂單失敗:', error);
      return false;
    }
  };

  const fetchUserOrders = async () => {
    try {
      orders.value = await getUserOrdersService();
    } catch (error) {
      console.error('載入訂單失敗:', error);
    }
  };

  return {
    isLoggedIn,
    products,
    cartItems,
    orders,
    userProfile,
    fetchProducts,
    loadCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    fetchUserProfile,
    fetchUserOrders,
    checkout
  };
});