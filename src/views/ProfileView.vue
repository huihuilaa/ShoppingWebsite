<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import OrderList from '../components/profile/OrderList.vue';
import InfoForm from '../components/profile/InfoForm.vue';

const emit = defineEmits<{
  (e: 'navigate', view: string): void
}>();

const activeTab = ref('orders');
const orders = ref<any[]>([]);
const loading = ref(true);
const userEmail = ref('');

const loadUserOrders = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    loading.value = false;
    emit('navigate', 'home');
    return;
  }

  userEmail.value = currentUser.email || '';

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
        <OrderList 
          v-if="activeTab === 'orders'" 
          :orders="orders" 
          :loading="loading" 
        />

        <InfoForm 
          v-if="activeTab === 'info'" 
          :initial-email="userEmail" 
          @save="handleSaveProfile" 
          @logout="handleLogout" 
        />
      </div>
    </div>
  </div>
</template>