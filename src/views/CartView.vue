<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const emit = defineEmits<{
  (e: 'navigate', view: string): void
}>();

const cartItems = ref<any[]>([]);
const shippingFee = ref(50);

const loadCartItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'carts'));
    cartItems.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(error);
  }
};

const updateQuantity = async (item: any, newQty: number) => {
  try {
    const docRef = doc(db, 'carts', item.id);
    await updateDoc(docRef, { quantity: Number(newQty) });
    item.quantity = Number(newQty);
  } catch (error) {
    console.error(error);
  }
};

const toggleCheck = async (item: any) => {
  try {
    const docRef = doc(db, 'carts', item.id);
    await updateDoc(docRef, { checked: !item.checked });
    item.checked = !item.checked;
  } catch (error) {
    console.error(error);
  }
};

const removeCartItem = async (id: string) => {
  if (!confirm('確定要將此商品從購物車中移除嗎？')) return;
  try {
    await deleteDoc(doc(db, 'carts', id));
    cartItems.value = cartItems.value.filter(item => item.id !== id);
  } catch (error) {
    console.error(error);
  }
};

const subtotal = computed(() => {
  return cartItems.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
});

const finalTotal = computed(() => {
  return subtotal.value > 0 ? subtotal.value + shippingFee.value : 0;
});

onMounted(() => {
  loadCartItems();
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
              <div class="cart-item-name-col">{{ item.title }}</div>
              <div class="cart-item-price-col">NT${{ item.price }}</div>
              <div class="cart-item-qty-col">
                <select 
                  :value="item.quantity" 
                  @change="updateQuantity(item, Number(($event.target as HTMLSelectElement).value))"
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
          
          <button class="pink-btn-rect checkout-submit-btn">
            結帳
          </button>
        </div>
      </div>
    </div>
  </div>
</template>