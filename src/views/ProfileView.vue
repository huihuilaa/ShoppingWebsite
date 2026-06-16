<script setup lang="ts">
import { ref } from 'vue';
import { useShopStore } from '../store/shop';

const store = useShopStore();
const activeTab = ref<'orders' | 'info'>('orders');
const expandedOrderId = ref<string | null>(null);

const emit = defineEmits(['logout']);

const toggleOrder = (id: string) => {
  expandedOrderId.value = expandedOrderId.value === id ? null : id;
};

const handleLogout = () => {
  emit('logout');
};
</script>

<template>
  <div class="container main-content">
    <div class="section-title" style="margin-bottom: 20px;">
      <span class="blue-sq">■</span> 會員中心
    </div>

    <div class="tab-header">
      <button class="tab-btn" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">訂單資訊</button>
      <button class="tab-btn" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">個人資料</button>
    </div>

    <div v-if="activeTab === 'orders'" class="tab-content">
      <div v-for="order in store.orders" :key="order.id" class="order-block">
        <div class="order-row-header" @click="toggleOrder(order.id)">
          <div class="cell">訂單編號 #{{ order.id }}</div>
          <div class="cell blue-text font-bold">{{ order.status }}</div>
          <div class="cell">總額：<span class="pink-text font-bold">NT${{ order.totalPrice }}</span></div>
          <div class="cell right-align">
            <button class="detail-toggle-btn" @click.stop="toggleOrder(order.id)">訂單明細</button>
          </div>
        </div>
        
        <div v-if="expandedOrderId === order.id" class="order-expanded-details">
          <div v-for="item in order.items" :key="item.title" class="expanded-item-row">
            <div class="exp-name">
              {{ item.title }} 
              <span v-if="item.spec"><small>({{ item.spec }})</small></span>
            </div>
            <div class="exp-qty">數量：{{ item.quantity }}</div>
            <div class="exp-price">NT${{ item.price }}</div>
            <div class="exp-subtotal pink-text">NT${{ item.price * item.quantity }}</div>
          </div>
          <div v-if="order.items.length === 0" class="empty-hint">無明細資料</div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'info'" class="tab-content info-container">
      <div class="form-grid">
        <div class="form-row"><label>姓名</label><input type="text" value=""></div>
        <div class="form-row"><label>電子郵件</label><input type="email" value="" disabled></div>
        <div class="form-row"><label>地址</label><input type="text" value=""></div>
        <div class="form-row"><label>電話號碼</label><input type="text" value=""></div>
      </div>
      <div class="form-action-row">
        <button class="logout-btn text-bold" @click="handleLogout">登出</button>
        <button class="pink-btn-rect text-bold" style="width: 120px;">儲存</button>
      </div>
    </div>
  </div>
</template>