<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  orders: any[];
  loading: boolean;
}>();

const expandedOrderId = ref<string | null>(null);

const toggleOrderDetail = (orderId: string) => {
  if (expandedOrderId.value === orderId) {
    expandedOrderId.value = null;
  } else {
    expandedOrderId.value = orderId;
  }
};
</script>

<template>
  <div class="tab-pane-view">
    <div v-if="loading" class="profile-loading-text">
      訂單資料載入中...
    </div>
    
    <div v-else-if="orders.length === 0" class="profile-empty-orders">
      目前沒有任何歷史訂單紀錄。
    </div>

    <div v-else class="orders-accordion-list">
      <div 
        v-for="order in orders" 
        :key="order.id" 
        class="order-accordion-group"
      >
        <div class="order-list-row-item">
          <div class="order-col-id">
            訂單編號 #{{ order.id }}
          </div>
          <div class="order-col-status">
            {{ order.status || '已付款' }}
          </div>
          <div class="order-col-total">
            總額：<span class="pink-total-text">NT${{ order.totalPrice }}</span>
          </div>
          <div class="order-col-action">
            <button class="btn-order-detail-outline" @click="toggleOrderDetail(order.id)">
              {{ expandedOrderId === order.id ? '收起明細' : '訂單明細' }}
            </button>
          </div>
        </div>

        <div 
          class="order-expanded-detail-panel"
          :class="{ 'is-open': expandedOrderId === order.id }"
        >
          <div class="expanded-inner-box">
            <div 
              v-for="(item, idx) in order.items" 
              :key="idx" 
              class="inner-product-row"
            >
              <div class="p-title-spec">
                {{ item.title }} 
                <span class="p-spec-hint" v-if="item.spec && item.spec !== '標準款'">
                  ({{ item.spec }})
                </span>
              </div>
              <div class="p-qty">
                數量：{{ item.quantity }}
              </div>
              <div class="p-single-price">
                NT${{ item.price }}
              </div>
              <div class="p-subtotal">
                NT${{ Number(item.price) * Number(item.quantity) }}
              </div>
            </div>
            
            <div v-if="order.customerInfo" style="font-size: 0.9rem; color: #64748b; margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
              收件人：{{ order.customerInfo.name }} | 寄送地址：{{ order.customerInfo.address }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-loading-text, .profile-empty-orders {
  color: #94a3b8;
  font-size: 1.1rem;
  text-align: center;
  padding: 60px 0;
}
.orders-accordion-list { display: flex; flex-direction: column; gap: 16px; }
.order-accordion-group { border-radius: 4px; overflow: hidden; }
.order-list-row-item {
  background-color: #f8fafc;
  padding: 24px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.order-col-id { font-size: 1.2rem; font-weight: bold; color: #334155; flex: 1.5; }
.order-col-status { font-size: 1.15rem; font-weight: bold; color: #3b82f6; flex: 1; text-align: center; }
.order-col-total { font-size: 1.15rem; font-weight: bold; color: #334155; flex: 1.5; text-align: center; }
.pink-total-text { color: #ff66a3; font-size: 1.25rem; }
.order-col-action { flex: 1; display: flex; justify-content: flex-end; }
.btn-order-detail-outline {
  background-color: #ffffff;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-order-detail-outline:hover { background-color: rgba(59, 130, 246, 0.05); }

.order-expanded-detail-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  background-color: #f1f5f9;
}
.order-expanded-detail-panel.is-open { max-height: 500px; }
.expanded-inner-box {
  padding: 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.inner-product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  color: #475569;
  padding: 8px 0;
}
.p-title-spec { flex: 2; font-weight: bold; color: #334155; }
.p-spec-hint { font-size: 0.95rem; color: #64748b; }
.p-qty { flex: 1; text-align: center; }
.p-single-price { flex: 1; text-align: center; font-weight: 500; }
.p-subtotal { flex: 1; text-align: right; font-weight: bold; color: #ff66a3; }
</style>