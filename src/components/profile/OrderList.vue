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
            訂單編號 #{{ order.orderId }}
          </div>
          <div class="order-col-status">
            {{ order.status || '已付款' }}
          </div>
          <div class="order-col-total">
            總額：<span class="pink-total-text">NT${{ order.totalAmount }}</span>
          </div>
          <div class="order-col-action">
            <button class="btn-order-detail-outline" @click="toggleOrderDetail(order.orderId)">
              訂單明細
            </button>
          </div>
        </div>

        <div 
          class="order-expanded-detail-panel"
          :class="{ 'is-open': expandedOrderId === order.orderId }"
        >
          <div class="expanded-inner-box">
            <div 
              v-for="(item, idx) in order.items" 
              :key="idx" 
              class="inner-product-row"
            >
              <div class="p-title-spec">
                {{ item.title }} 
                <span class="p-spec-hint" v-if="item.selectedSpec && item.selectedSpec !== '標準款'">
                  ({{ item.selectedSpec }})
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>