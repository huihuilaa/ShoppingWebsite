<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const router = useRouter();
const leaveAdmin = () => {
  sessionStorage.removeItem('adminVerified');
  router.push('/');
};

const title = ref('');
const price = ref(0);
const imageUrl = ref('');
const specInput = ref('');
const description = ref('');

const products = ref<any[]>([]);
const editingId = ref<string | null>(null);

const ITEMS_PER_PAGE = 5;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(products.value.length / ITEMS_PER_PAGE)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return products.value.slice(start, start + ITEMS_PER_PAGE);
});

const loadAdminProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    products.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(error);
  }
};

const handleUpload = async () => {
  if (!title.value || price.value <= 0 || !imageUrl.value) {
    alert('請填寫完整的商品資訊！');
    return;
  }

  try {
    const productData = {
      title: title.value,
      price: Number(price.value),
      imageUrl: imageUrl.value,
      status: 'published',
      specs: specInput.value ? specInput.value.split(',').map(s => s.trim()) : [],
      bookingPeriod: '',
      releaseDate: '',
      shippingDate: '',
      contentDesc: description.value,
      sizeMaterial: '',
      createdAt: new Date().getTime()
    };

    if (editingId.value) {
      const docRef = doc(db, 'products', editingId.value);
      await updateDoc(docRef, productData);
      alert('商品更新成功！');
      editingId.value = null;
    } else {
      await addDoc(collection(db, 'products'), productData);
      alert('商品成功上傳至 Firestore！');
    }

    title.value = '';
    price.value = 0;
    imageUrl.value = '';
    specInput.value = '';
    description.value = '';

    await loadAdminProducts();
    currentPage.value = 1;
  } catch (error) {
    console.error(error);
    alert('操作失敗，請檢查權限。');
  }
};

const startEdit = (product: any) => {
  editingId.value = product.id;
  title.value = product.title || '';
  price.value = product.price || 0;
  imageUrl.value = product.imageUrl || '';
  description.value = product.contentDesc || '';
  specInput.value = product.specs ? product.specs.join(', ') : '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  editingId.value = null;
  title.value = '';
  price.value = 0;
  imageUrl.value = '';
  specInput.value = '';
  description.value = '';
};

const handleDelete = async (id: string) => {
  if (!confirm('確定要刪除這項商品嗎？')) return;
  try {
    await deleteDoc(doc(db, 'products', id));
    alert('商品已刪除！');
    await loadAdminProducts();
    if (currentPage.value > totalPages.value) {
      currentPage.value = Math.max(1, totalPages.value);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  loadAdminProducts();
});
</script>

<template>
  <div class="container main-content auth-page-container">
    <div class="auth-card">
      <div class="admin-header-row" style="display:flex; justify-content:space-between; align-items:center;">
        <h2 class="auth-title">{{ editingId ? '編輯商品資訊' : '上傳新商品 (管理員後台)' }}</h2>
        <button class="secondary-btn-rect" @click="leaveAdmin" style="font-size:0.85rem;">離開後台</button>
      </div>
      
      <div class="auth-form">
        <div class="auth-field">
          <label>商品名稱與別名</label>
          <input type="text" v-model="title">
        </div>
        <div class="auth-field">
          <label>商品價格</label>
          <input type="number" v-model="price">
        </div>
        <div class="auth-field">
          <label>圖片路徑或網址</label>
          <input type="text" v-model="imageUrl">
        </div>
        <div class="auth-field">
          <label>商品規格 (多個請用英文逗號隔開)</label>
          <input type="text" v-model="specInput">
        </div>
        <div class="auth-field">
          <label>商品內容詳情說明</label>
          <textarea v-model="description" rows="5"></textarea>
        </div>
        
        <div class="auth-action-row admin-btn-group">
          <button class="pink-btn-rect text-bold" @click="handleUpload">
            {{ editingId ? '確認儲存修改' : '確認上傳商品' }}
          </button>
          <button v-if="editingId" class="secondary-btn-rect text-bold" @click="cancelEdit">
            取消編輯
          </button>
        </div>
      </div>
    </div>

    <div class="auth-card admin-list-card">
      <h3 class="auth-title admin-list-title">現有商品清單庫存</h3>

      <div v-if="products.length === 0" class="admin-empty-text">目前資料庫沒有任何商品</div>

      <template v-else>
        <div class="admin-list-wrapper">
          <div
            v-for="item in paginatedProducts"
            :key="item.id"
            class="admin-list-item"
          >
            <div class="admin-item-left">
              <img :src="item.imageUrl" class="admin-item-img">
              <div>
                <div class="admin-item-title">{{ item.title }}</div>
                <div class="admin-item-price">NT${{ item.price }}</div>
              </div>
            </div>
            <div class="admin-item-actions">
              <button class="secondary-btn-rect admin-action-btn" @click="startEdit(item)">編輯</button>
              <button class="pink-btn-rect admin-action-btn admin-delete-btn" @click="handleDelete(item.id)">刪除</button>
            </div>
          </div>
        </div>

        <div class="pagination-wrap" v-if="totalPages > 1">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >‹</button>

          <button
            v-for="page in totalPages"
            :key="page"
            class="page-btn"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >{{ page }}</button>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >›</button>
        </div>
      </template>
    </div>
  </div>
</template>