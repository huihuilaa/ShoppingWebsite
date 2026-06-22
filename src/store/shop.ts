import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { auth } from '../lib/firebase';
import { getAllProductsService } from '../api/products'; // ✅ 修正為正確的 Service 名稱
import { getUserOrdersService } from '../api/orders';     // ✅ 修正為正確的 Service 名稱
import { getCartItemsService, addCartItemService, removeCartItemService, updateCartItemService } from '../api/cart';
import type { Product, CartItem, Order } from '../types';

export const useShopStore = defineStore('shop', () => {
  const isLoggedIn = ref(false);
  const products = ref<Product[]>([]);
  const cartItems = ref<CartItem[]>([]);
  const orders = ref<Order[]>([]);
  const cartLoaded = ref(false);

  // 取得商品列表
  const fetchProducts = async () => {
    try {
      products.value = await getAllProductsService() as Product[];
    } catch (error) {
      console.error('取得商品失敗:', error);
    }
  };

  // 載入購物車
  const loadCart = async (force = false) => {
    if (cartLoaded.value && !force) return;
    try {
      const data = await getCartItemsService();
      // ✅ 確保符合 CartItem[] 型別轉換
      cartItems.value = data as unknown as CartItem[];
      cartLoaded.value = true;
    } catch (error) {
      console.error('載入購物車失敗:', error);
    }
  };

  // 加入購物車
  const addToCart = async (product: Product, spec: string, quantity: number) => {
    const user = auth.currentUser;
    if (!user) {
      alert('請先登入！');
      return;
    }

    // ✅ 修正：依據 types.ts，從 item.product.id 比對
    const existingItem = cartItems.value.find(item => item.product.id === product.id && item.selectedSpec === spec);

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      await updateCartItemService(existingItem.id, { quantity: newQty });
      existingItem.quantity = newQty;
    } else {
      const newItemData = {
        userId: user.uid,
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        selectedSpec: spec || '標準款',
        quantity,
        checked: true,
        createdAt: new Date().getTime()
      };
      const newId = await addCartItemService(newItemData);
      
      cartItems.value.unshift({
        id: newId,
        product: product,
        selectedSpec: spec || '標準款',
        quantity,
        checked: true
      });
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

  const fetchUserOrders = async () => {
    try {
      orders.value = await getUserOrdersService() as Order[];
    } catch (error) {
      console.error('載入訂單失敗:', error);
    }
  };

  const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });

  return {
    isLoggedIn,
    products,
    cartItems,
    orders,
    fetchProducts,
    loadCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    fetchUserOrders,
    cartTotal
  };
});