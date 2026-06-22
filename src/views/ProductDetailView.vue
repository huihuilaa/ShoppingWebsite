<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useShopStore } from '../store/shop';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const route = useRoute();
const store = useShopStore();

const product = ref(null);
const loading = ref(true);
const error = ref(false);
const quantity = ref(1);

onMounted(async () => {
  try {
    const docRef = doc(db, 'products', route.params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      product.value = { id: docSnap.id, ...docSnap.data() };
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="loading-state">
    <p>商品詳細資訊載入中...</p>
  </div>
  
  <div v-else-if="error" class="error-state">
    <h3>抱歉，該商品不存在或已下架。</h3>
    <RouterLink to="/" class="back-home-btn">返回首頁</RouterLink>
  </div>

  <div v-else-if="product" class="detail-container">
    <div class="detail-layout">
      <div class="detail-left">
        <img :src="product.image" :alt="product.title">
      </div>
      <div class="detail-right">
        <h2>{{ product.title }}</h2>
        <p class="price">NT$ {{ product.price }}</p>
        <p class="desc">{{ product.description }}</p>
        
        <div class="quantity-selector">
          <button @click="quantity > 1 ? quantity-- : null">-</button>
          <span>{{ quantity }}</span>
          <button @click="quantity++">+</button>
        </div>

        <button class="add-cart-btn" @click="store.addToCart(product, quantity)">
          加入購物車
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 60px;
  padding: 60px 0;
  width: 100%;
}
.detail-img-wrap {
  width: 100%;
  max-width: 450px;
  aspect-ratio: 1 / 1;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
}
.detail-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

.detail-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
.detail-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 30px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.detail-alias { font-size: 1.5rem; color: #8293a5; font-weight: 500; }
.detail-price { font-size: 1.35rem; color: #ff66a3; font-weight: bold; }

.info-row-group { display: flex; flex-direction: column; }
.detail-info .info-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.detail-info .info-row.align-start { align-items: flex-start; }

.info-label {
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  margin-right: 8px;
}
.btn-label-pad { padding-top: 6px; }

/* 規格按鈕 */
.detail-spec-buttons-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
}
.detail-info .info-row .detail-spec-buttons-wrap button.spec-select-btn {
  background-color: #f0f6fc;
  border: 1px solid #5ea6e4;
  color: #5ea6e4;
  font-size: 0.95rem;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  outline: none;
  margin: 0;
  width: auto;
  height: auto;
}
.detail-info .info-row .detail-spec-buttons-wrap button.spec-select-btn:hover {
  background-color: #e1eefc;
}
.detail-info .info-row .detail-spec-buttons-wrap button.spec-select-btn.active {
  background-color: #ff66a3;
  border: 1px solid #ff66a3;
  color: #ffffff;
}

/* 數量選擇器 */
.detail-info .info-row .quantity-counter-box {
  display: inline-flex;
  align-items: center;
  border: 1px solid #5ea6e4;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  height: 32px;
  box-sizing: border-box;
}
.detail-info .info-row .quantity-counter-box button {
  background-color: #ffffff;
  border: none;
  color: #5ea6e4;
  font-size: 1.1rem;
  font-weight: bold;
  width: 32px;
  min-width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;
  outline: none;
  box-sizing: border-box;
}
.detail-info .info-row .quantity-counter-box button:hover:not(:disabled) {
  background-color: #f0f6fc;
}
.detail-info .info-row .quantity-counter-box button:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}
.detail-info .info-row .quantity-counter-box .qty-number-display {
  width: 36px;
  min-width: 36px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: bold;
  color: #1a1a1a;
  border-left: 1px solid #5ea6e4;
  border-right: 1px solid #5ea6e4;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 加入購物車 / 立即購買 按鈕 */
.detail-info .detail-action-margin { margin-top: 35px; }
.action-group { display: flex; gap: 15px; width: 100%; }
.detail-info button.pink-btn-rect.btn-detail-add-cart {
  background-color: #ffffff;
  border: 1px solid #5ea6e4;
  color: #5ea6e4;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 0.95rem;
  width: auto;
  height: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: background-color 0.2s;
  outline: none;
}
.detail-info button.pink-btn-rect.btn-detail-add-cart:hover {
  background-color: #f0f6fc;
}
.btn-buy-now {
  background-color: #ff66a3;
  border: 1px solid #ff66a3;
  color: #ffffff;
  font-weight: bold;
  border-radius: 0;
  padding: 10px 35px;
  font-size: 0.95rem;
  cursor: pointer;
  white-space: nowrap;
}

/* 商品資訊區塊 */
.product-info-section {
  padding-top: 40px;
  padding-bottom: 100px;
  max-width: 900px;
  margin: 0 auto;
}
.product-info-section .section-title {
  font-size: 1.35rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 40px;
}
.custom-info-box {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px 0;
}
.custom-info-box .content-row { display: flex; align-items: flex-start; }
.custom-info-box .content-label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.15rem;
  white-space: nowrap;
  min-width: 100px;
}
.custom-text-style {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.15rem;
  margin: 0;
  line-height: 1.6;
}
.pre-line-style { white-space: pre-line; }
</style>