<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useShopStore } from '../store/shop';
import InfoForm from '../components/profile/InfoForm.vue';
import OrderList from '../components/profile/OrderList.vue';

const router = useRouter();
const store = useShopStore();
const activeTab = ref<'info' | 'orders'>('info');
const userEmail = ref('');
const userName = ref('');
const userAddress = ref('');
const userPhone = ref('');
const ordersLoading = ref(false);

const loadProfile = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  userEmail.value = currentUser.email || '';
  try {
    const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      userName.value = data.name || '';
      userAddress.value = data.address || '';
      userPhone.value = data.phone || '';
    }
  } catch (error) {
    console.error('載入會員資料失敗:', error);
  }
};

const loadOrders = async () => {
  ordersLoading.value = true;
  await store.fetchUserOrders();
  ordersLoading.value = false;
};

const handleSave = async (formData: { name: string; email: string; address: string; phone: string }) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  try {
    await setDoc(doc(db, 'users', currentUser.uid), {
      name: formData.name,
      email: formData.email,
      address: formData.address,
      phone: formData.phone,
      updatedAt: new Date().getTime(),
    }, { merge: true });
    alert('資料已儲存！');
  } catch (error) {
    console.error('儲存失敗:', error);
    alert('儲存失敗，請稍後再試');
  }
};

const handleLogout = async () => {
  await signOut(auth);
  store.isLoggedIn = false;
  sessionStorage.removeItem('adminVerified');
  router.push('/');
};

const switchTab = (tab: 'info' | 'orders') => {
  activeTab.value = tab;
  if (tab === 'orders') {
    loadOrders();
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div class="container main-content">
    <div class="profile-tab-container">
      <div class="profile-header-title">
        <span class="blue-sq">■</span>會員中心
      </div>

      <div class="profile-tabs-nav">
        <button
          class="tab-nav-btn"
          :class="{ active: activeTab === 'info' }"
          @click="switchTab('info')"
        >
          會員資料
        </button>
        <button
          class="tab-nav-btn"
          :class="{ active: activeTab === 'orders' }"
          @click="switchTab('orders')"
        >
          訂單紀錄
        </button>
      </div>

      <div class="profile-tab-content-card">
        <InfoForm
          v-if="activeTab === 'info'"
          :initial-email="userEmail"
          :initial-name="userName"
          :initial-address="userAddress"
          :initial-phone="userPhone"
          @save="handleSave"
          @logout="handleLogout"
        />
        <OrderList
          v-if="activeTab === 'orders'"
          :orders="store.orders"
          :loading="ordersLoading"
        />
      </div>
    </div>
  </div>
</template>
