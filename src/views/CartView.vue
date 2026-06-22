<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '../store/shop';

const router = useRouter();
const store = useShopStore();
const cartItems = computed(() => store.cartItems);
const shippingFee = 50;

const updateQuantity = async (id: string, newQty: number) => {
  await store.updateCartQuantity(id, newQty);
};

const toggleCheck = async (item: any) => {
  try {
    const { updateCartItemService } = await import('../api/cart');
    await updateCartItemService(item.id, { checked: !item.checked });
    item.checked = !item.checked;
  } catch (error) {
    console.error(error);
  }
};

const removeCartItem = async (id: string) => {
  if (!confirm('確定要將此商品從購物車中移除嗎？')) return;
  await store.removeFromCart(id);
};

const subtotal = computed(() =>
  cartItems.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
);

const finalTotal = computed(() =>
  subtotal.value > 0 ? subtotal.value + shippingFee : 0
);

const handleCheckout = async () => {
  const checkedItems = cartItems.value.filter(item => item.checked);
  if (checkedItems.length === 0) {
    alert('您的購物車中沒有選取任何商品！');
    return;
  }

  const profile = await store.fetchUserProfile();

  if (!profile) {
    alert('您的個人寄送資訊（姓名、電話或地址）尚未填寫完整，將自動為您跳轉至會員中心補齊！');
    router.push({ 
      name: 'profile', 
      query: { redirect: '/cart', tab: 'info' }
    });
    return;
  }

  const confirmText = `確認使用以下資訊進行結帳嗎？\n\n收件人：${profile.name}\n電話：${profile.phone}\n地址：${profile.address}`;
  if (!confirm(confirmText)) return;

  const newOrderId = await store.checkout(profile);
  if (newOrderId) {
    router.push({ name: 'order-success', query: { id: newOrderId } });
  }
};

onMounted(() => {
  store.loadCart();
});
</script>

<template>
  <div class="container main-content cart-page-container">
    <div class="cart-header-title">
      <span class="blue-sq">■</span> 購物車
    </div>
    
    <div class="cart-two-columns-layout">
      <div class="cart-main-items-col">
        <div v-if="cartItems.length === 0" class="cart-empty-text-line">
          <span>購物車是空的</span>
        </div>

        <div v-else class="cart-items-list-inner">
          <div 
            v-for="item in cartItems" 
            :key="item.id" 
            class="cart-row-card-item"
          >
            <div class="cart-checkbox-outside">
              <input 
                type="checkbox" 
                :checked="item.checked" 
                @change="toggleCheck(item)"
                class="cart-custom-checkbox"
              >
            </div>
            
            <div class="cart-main-info-card">
              <div class="cart-item-name-col">
                {{ item.title }}
                <small v-if="item.selectedSpec" style="display: block; color: #888; margin-top: 2px;">
                  規格：{{ item.selectedSpec }}
                </small>
              </div>
              <div class="cart-item-price-col">NT${{ item.price }}</div>
              <div class="cart-item-qty-col">
                <select 
                  :value="item.quantity" 
                  @change="updateQuantity(item.id, Number(($event.target as HTMLSelectElement).value))"
                  class="cart-card-select"
                >
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="cart-item-action-col">
                <button class="cart-card-delete-btn" @click="removeCartItem(item.id)">刪除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary-sidebar-col">
        <div class="checkout-detail-card">
          <h3 class="checkout-card-title">結帳明細</h3>
          
          <div class="summary-line">
            <span class="label">商品總金額</span>
            <span class="value">NT${{ subtotal }}</span>
          </div>
          
          <div class="summary-line">
            <span class="label">運費</span>
            <span class="value shipping-fee-text">NT${{ subtotal > 0 ? shippingFee : 0 }}</span>
          </div>
          
          <hr class="summary-hr">
          
          <div class="summary-line final-total-row">
            <span class="label">結帳金額</span>
            <span class="value total-price-red">NT${{ finalTotal }}</span>
          </div>
          
          <button class="pink-btn-rect checkout-submit-btn" @click="handleCheckout">
            結帳
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page-container {
  max-width: 1000px;
  margin: 40px auto 0 auto;
  padding: 0 20px;
}
.cart-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a252f;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}
.cart-header-title .blue-sq {
  color: #3498db;
  margin-right: 8px;
}

.cart-two-columns-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  width: 100%;
}
.cart-main-items-col {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.cart-summary-sidebar-col {
  flex: 1;
  position: sticky;
  top: 100px;
}

.cart-empty-text-line {
  display: block;
  width: 100%;
  font-size: 1.1rem;
  color: #a0aec0;
  padding: 30px 0;
  text-align: left;
}
.cart-items-list-inner { display: flex; flex-direction: column; gap: 16px; }
.cart-row-card-item { display: flex; align-items: center; width: 100%; }
.cart-checkbox-outside {
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-custom-checkbox {
  width: 22px;
  height: 22px;
  cursor: pointer;
  border: 1px solid #3498db;
  border-radius: 4px;
}
.cart-main-info-card {
  flex: 1;
  background-color: #f1f5f9;
  border-radius: 4px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cart-item-name-col, .cart-item-price-col {
  font-size: 1.05rem;
  color: #2c3e50;
}
.cart-item-name-col { flex: 2; text-align: left; font-weight: bold; }
.cart-item-price-col { font-weight: bold; flex: 1; text-align: center; }
.cart-item-qty-col { flex: 1; display: flex; justify-content: center; }
.cart-card-select {
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  padding: 6px 20px;
  font-size: 1rem;
  color: #2c3e50;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
.cart-item-action-col { flex: 1; display: flex; justify-content: flex-end; }
.cart-card-delete-btn {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  color: #718096;
  font-size: 1.05rem;
  font-weight: bold;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cart-card-delete-btn:hover { background-color: #edf2f7; color: #2c3e50; }

.checkout-detail-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 30px;
}
.checkout-card-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 25px;
  text-align: center;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.summary-line .label, .summary-line .value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}
.shipping-fee-text { color: #7f8c8d !important; }
.final-total-row { margin-bottom: 30px; }
.total-price-red { color: #ff66a3 !important; font-size: 1.4rem !important; }
.summary-hr { border: none; border-top: 1px solid #e2e8f0; margin: 10px 0 20px; }
.checkout-submit-btn { width: 100%; padding: 12px 0; font-size: 1.2rem; border-radius: 4px; }
</style>