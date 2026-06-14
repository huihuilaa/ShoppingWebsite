import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product, CartItem, Order } from '../types';

export const useShopStore = defineStore('shop', () => {
  // 1. 全域商品資料 (已將 imageUrl 全面中文化/本地檔案路徑化)
  const products = ref<Product[]>([
    { 
      id: 'p1', 
      title: "ヒメヒナミニぬい", 
      alias: "ver.ひめ", 
      price: 600, 
      imageUrl: "/images/hime_doll.png",
      isFeatured: true, 
      status: 'published', 
      specs: ["ver.ひめ"], 
      releaseDate: "2026年4月24日(金) 起陸續發售", 
      bookingPeriod: "預計於 2026年6月起 發售", 
      shippingDate: "預計於 2026年8月中旬過後 依點單順序陸續出貨\n*8月之後的訂單將於9月陸續配送", 
      contentDesc: "HIMEHINA 胖娃玩偶 ver.ひめ × 1", 
      sizeMaterial: "全長約 130mm / 材質：聚酯、鐵" 
    },
    { 
      id: 'p2', 
      title: "ヒメヒナミニぬい", 
      alias: "ver.ひな", 
      price: 600, 
      imageUrl: "../assets/hina-doll.webp",
      isFeatured: true, 
      status: 'published', 
      specs: ["ver.ひな"],
      releaseDate: "2026年4月24日(金) 起陸續發售", 
      bookingPeriod: "預計於 2026年6月起 發售", 
      shippingDate: "預計於 2026年8月中旬過後 依點單順序陸續出貨", 
      contentDesc: "HIMEHINA 胖娃玩偶 ver.ひな × 1", 
      sizeMaterial: "全長約 130mm / 材質：聚酯、鐵"
    },
    { 
      id: 'p3', 
      title: "ヒメヒナミニぬい", 
      alias: "ver.ジョジうさ", 
      price: 600, 
      imageUrl: "/images/joji_usa.png", // 💡 對應 public/images/joji_usa.png
      isFeatured: true, 
      status: 'published', 
      specs: ["標準款"],
      releaseDate: "2026年4月24日(金) 起陸續發售", 
      bookingPeriod: "預計於 2026年6月起 發售", 
      shippingDate: "預計於 2026年8月中旬過後 依點單順序陸續出貨", 
      contentDesc: "HIMEHINA 胖娃玩偶 ver.ジョジうさ × 1", 
      sizeMaterial: "全長約 120mm / 材質：聚酯、鐵"
    },
    { 
      id: 'p4', 
      title: "パブサマー T", 
      alias: "ver.WORLD", 
      price: 800, 
      imageUrl: "/images/tshirt_world.png", 
      status: 'published', 
      specs: ["S Size", "M Size", "L Size", "XL Size"],
      releaseDate: "現貨發售中",
      bookingPeriod: "常態販售",
      shippingDate: "下單後 3 個工作天內出貨",
      contentDesc: "主題設計短 T × 1",
      sizeMaterial: "材質：100% 純棉"
    },
    { 
      id: 'p5', 
      title: "パブサマー涼感タオル", 
      alias: "ver.WORLD", 
      price: 600, 
      imageUrl: "/images/towel_world.png", 
      status: 'published', 
      specs: ["標準款"],
      releaseDate: "現貨發售中",
      bookingPeriod: "常態販售",
      shippingDate: "下單後 3 個工作天內出貨",
      contentDesc: "運動涼感運動毛巾 × 1",
      sizeMaterial: "約 200×1100mm / 材質：聚酯纖維"
    },
    { 
      id: 'p6', 
      title: "ヒメヒナダイカットビジュアルパネル", 
      alias: "全1種", 
      price: 1100, 
      imageUrl: "/images/visual_panel.png", 
      status: 'published', 
      specs: ["標準款"],
      releaseDate: "近期發售",
      bookingPeriod: "數量限定預購",
      shippingDate: "預計 2026 年 9 月左右配送",
      contentDesc: "壓克力視覺裝飾壓克力板 × 1",
      sizeMaterial: "A4 比例大小 / 材質：壓克力"
    },
    { 
      id: 'p7', 
      title: "ヒメヒナアクリルスタンド", 
      alias: "ver.Cute", 
      price: 350, 
      imageUrl: "/images/stand_cute.png", 
      status: 'published', 
      specs: ["標準款"],
      releaseDate: "現貨供應",
      bookingPeriod: "常態販售",
      shippingDate: "下單後 3 個工作天內出貨",
      contentDesc: "角色立牌-可愛款 × 1",
      sizeMaterial: "高約 140mm / 材質：壓克力"
    },
    { 
      id: 'p8', 
      title: "ヒメヒナアクリルスタンド", 
      alias: "ver.Cool", 
      price: 350, 
      imageUrl: "/images/stand_cool.png", 
      status: 'published', 
      specs: ["標準款"],
      releaseDate: "現貨供應",
      bookingPeriod: "常態販售",
      shippingDate: "下單後 3 個工作天內出貨",
      contentDesc: "角色立牌-酷帥款 × 1",
      sizeMaterial: "高約 140mm / 材質：壓克力"
    }
  ]);

  const cartItems = ref<CartItem[]>([]);
  
  const orders = ref<Order[]>([
    { id: 'CC0001', status: '運送中', totalPrice: 1200, items: [{ title: 'JOJIPPEN', spec: '標準款', quantity: 1, price: 600 }] },
    { id: 'CC0002', status: '已付款', totalPrice: 1850, items: [] },
    { id: 'CC0003', status: '已完成', totalPrice: 930, items: [] }
  ]);

  const shippingFee = ref(150);

  // 2. 計算屬性 (Getters)
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

  // 3. 動作方法 (Actions)
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