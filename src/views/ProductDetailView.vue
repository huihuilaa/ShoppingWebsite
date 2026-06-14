<template>
  <div class="container main-content">
    <div class="detail-top-layout">
      <div class="detail-left-img">
        <img :src="product.imageUrl" alt="Product Image">
      </div>
      
      <div class="detail-right-meta">
        <h1 class="detail-title">{{ product.title }} {{ product.alias }}</h1>
        <div class="detail-price">價格 NT${{ product.price }}</div>
        
        <div class="meta-row">
          <label>規格</label>
          <select v-model="selectedSpec" class="spec-dropdown">
            <option v-for="s in product.specs" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="meta-row">
          <label>數量</label>
          <div class="qty-box">
            <button type="button" @click="decreaseQty">-</button>
            <input type="number" v-model.number="qty" min="1" readonly>
            <button type="button" @click="increaseQty">+</button>
          </div>
        </div>

        <div class="btn-wrap">
          <button class="pink-btn-rect text-bold" @click="handleAddToCart">加入購物車</button>
          <button class="pink-btn-rect inverse text-bold" @click="store.addToCart(product, selectedSpec, qty); emit('navigate', 'cart')">立即購買</button>
        </div>
      </div>
    </div>

    <div class="detail-bottom-info" v-if="product.releaseDate">
      <h3 class="info-header">■ 商品資訊 PRODUCT INFO</h3>
      <div class="info-content">
        <div class="info-line" style="white-space: pre-line;"><strong>發售狀態：</strong>{{ product.releaseDate }}</div>
        <div class="info-line" style="white-space: pre-line;"><strong>預購日期：</strong>{{ product.bookingPeriod }}</div>
        <div class="info-line" style="white-space: pre-line;"><strong>商品配送：</strong>{{ product.shippingDate }}</div>
        <div class="info-line" style="white-space: pre-line;"><strong>商品內容：</strong>{{ product.contentDesc }}</div>
        <div class="info-line" style="white-space: pre-line;"><strong>商品規格：</strong>{{ product.sizeMaterial }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useShopStore } from '../store/shop';
import type { Product } from '../types';

const props = defineProps<{ productId: string }>();
const emit = defineEmits(['navigate']);
const store = useShopStore();

const product = computed<Product>(() => {
  const found = store.products.find(p => p.id === props.productId);
  if (!found) {
    return store.products[0] || {
      id: 'fallback',
      title: '商品不存在',
      alias: '',
      price: 0,
      imageUrl: '',
      status: 'archived',
      specs: ['標準款']
    };
  }
  return found;
});
const selectedSpec = ref(product.value?.specs?.[0] || '標準款');
const qty = ref(1);

const increaseQty = () => { qty.value++; };
const decreaseQty = () => {
  if (qty.value > 1) {
    qty.value--;
  }
};

const handleAddToCart = () => {
  store.addToCart(product.value, selectedSpec.value, qty.value);
  alert(`已將 ${qty.value} 件商品成功加入購物車！`);
};
</script>