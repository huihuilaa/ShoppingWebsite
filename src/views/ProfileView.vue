<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const emit = defineEmits<{
  (e: 'navigate', view: string): void
}>();

const activeTab = ref('orders');
const orders = ref<any[]>([]);
const loading = ref(true);
const expandedOrderId = ref<string | null>(null);

const profileForm = ref({
  name: '',
  email: '',
  address: '',
  phone: ''
});

const loadUserOrders = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    loading.value = false;
    emit('navigate', 'home');
    return;
  }

  profileForm.value.email = currentUser.email || '';

  try {
    loading.value = true;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    orders.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const toggleOrderDetail = (orderId: string) => {
  if (expandedOrderId.value === orderId) {
    expandedOrderId.value = null;
  } else {
    expandedOrderId.value = orderId;
  }
};

const handleSaveProfile = () => {
  window.alert('個人資料儲存成功！');
};

const handleLogout = async () => {
  if (!confirm('確定要登出系統嗎？')) return;
  try {
    await signOut(auth);
    window.alert('已成功登出會員系統！');
    emit('navigate', 'home');
  } catch (error) {
    console.error('登出失敗：', error);
  }
};

onMounted(() => {
  loadUserOrders();
});
</script>

<template>
  <div class="profile-page-wrapper">
    <div class="profile-tab-container">
      <div class="profile-header-title">
        <span class="blue-sq">■</span> 會員中心
      </div>

      <div class="profile-tabs-nav">
        <button 
          class="tab-nav-btn" 
          :class="{ active: activeTab === 'orders' }" 
          @click="activeTab = 'orders'"
        >
          訂單資訊
        </button>
        <button 
          class="tab-nav-btn" 
          :class="{ active: activeTab === 'info' }" 
          @click="activeTab = 'info'"
        >
          個人資料
        </button>
      </div>

      <div class="profile-tab-content-card">
        <div v-if="activeTab === 'orders'" class="tab-pane-view">
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
                      {{ item.title }} <span class="p-spec-hint" v-if="item.selectedSpec && item.selectedSpec !== '標準款'">({{ item.selectedSpec }})</span>
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

        <div v-if="activeTab === 'info'" class="tab-pane-view info-form-layout">
          <div class="form-fields-column">
            <div class="form-input-group-row">
              <label class="form-input-label">姓名</label>
              <input type="text" v-model="profileForm.name" class="form-clean-input">
            </div>
            
            <div class="form-input-group-row">
              <label class="form-input-label">電子郵件</label>
              <input type="email" v-model="profileForm.email" class="form-clean-input">
            </div>
            
            <div class="form-input-group-row">
              <label class="form-input-label">地址</label>
              <input type="text" v-model="profileForm.address" class="form-clean-input">
            </div>
            
            <div class="form-input-group-row">
              <label class="form-input-label">電話號碼</label>
              <input type="text" v-model="profileForm.phone" class="form-clean-input">
            </div>
          </div>

          <div class="form-action-btn-row">
            <button class="btn-profile-logout" @click="handleLogout">
              登出
            </button>
            <button class="pink-btn-rect text-bold btn-submit-profile" @click="handleSaveProfile">
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>