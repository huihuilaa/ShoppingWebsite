<script setup lang="ts">
import { useShopStore } from '../store/shop';

const emit = defineEmits(['navigate']);
const store = useShopStore();

const shouldShowAlias = (title: string) => {
  return /ver\./i.test(title);
};

const handleCheckout = () => {
  if (store.cartSubtotal === 0) {
    alert('請至少勾選一項商品進行結帳！');
    return;
  }
  
  if (!store.isLoggedIn) {
    alert('請先登入會員再進行結帳！');
    emit('navigate', 'login');
    return;
  }
  
  emit('navigate', 'profile');
};
</script>

<template>
  <div class="container main-content">
    <div class="section-title" style="margin-bottom: 20px;">
      <span class="blue-sq">■</span> 購物車
    </div>

    <div class="cart-split-layout">
      <div class="cart-left-list">
        <div v-for="item in store.cartItems" :key="item.id" class="cart-item-row">
          <input type="checkbox" v-model="item.checked" class="cart-checkbox">
          <div class="cart-item-name">
            {{ item.product.title }}
            <span v-if="item.product.alias && shouldShowAlias(item.product.title)"> {{ item.product.alias }}</span>
            <small>({{ item.selectedSpec }})</small>
          </div>
          <div class="cart-item-price">NT${{ item.product.price }}</div>
          <div class="cart-item-qty">
            <input type="number" v-model.number="item.quantity" min="1" class="cart-qty-input">
          </div>
          <div class="cart-item-action" @click="store.removeFromCart(item.id)">刪除</div>
        </div>
        <div v-if="store.cartItems.length === 0" class="empty-cart-hint">購物車空空如也...</div>
      </div>

      <div class="cart-right-summary">
        <div class="summary-box">
          <h4 class="summary-title">結帳明細</h4>
          <div class="summary-item">
            <span>商品總金額</span>
            <strong>NT${{ store.cartSubtotal }}</strong>
          </div>
          <div class="summary-item">
            <span>運費</span>
            <strong>NT${{ store.cartItems.some(i => i.checked) ? store.shippingFee : 0 }}</strong>
          </div>
          <div class="summary-item total-row">
            <span>結帳金額</span>
            <strong class="pink-text">NT${{ store.cartTotalPrice }}</strong>
          </div>
          <button class="checkout-btn" @click="handleCheckout">結帳</button>
        </div>
      </div>
    </div>
  </div>
</template>