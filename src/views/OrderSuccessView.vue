<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const orderId = route.query.id as string || 'UNKNOWN';

const goHome = () => {
  router.push('/');
};

const goOrders = () => {
      router.push({ 
      name: 'profile', 
      query: { redirect: '/cart', tab: 'orders' }
    });
};


</script>

<template>
  <div class="container main-content success-page-container">
    <div class="success-card">
      <div class="success-icon-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      
      <h2 class="success-title">感謝您的購買！訂單已成立</h2>
      <p class="success-subtitle">我們已經收到您的付款，商品將會盡快安排寄出。</p>
      
      <div class="order-info-box">
        <span class="info-label">系統訂單編號：</span>
        <span class="info-value-id">{{ orderId }}</span>
      </div>
      
      <div class="success-actions-row">
        <button class="pink-btn-rect" @click="goHome">繼續購物</button>
        <button class="outline-btn-rect" @click="goOrders">查看我的訂單</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
}
.success-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 50px 40px;
  width: 100%;
  max-width: 650px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.success-icon-circle {
  width: 90px;
  height: 90px;
  background-color: #f0fdf4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px auto;
}
.success-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 12px;
}
.success-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 30px;
}
.order-info-box {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 15px 20px;
  font-size: 1rem;
  margin-bottom: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.info-label { color: #475569; font-weight: bold; }
.info-value-id { color: #5ea6e4; font-weight: bold; font-family: monospace; }

.success-actions-row {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.success-actions-row .pink-btn-rect {
  min-width: 160px;
}
.outline-btn-rect {
  min-width: 160px;
  background: none;
  border: 1px solid #cbd5e1;
  color: #475569;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  padding: 12px 24px;
  transition: all 0.2s;
}
.outline-btn-rect:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
}
</style>