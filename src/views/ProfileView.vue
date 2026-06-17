<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useShopStore } from '../store/shop';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const props = withDefaults(
  defineProps<{
    productId?: string;
  }>(),
  {
    productId: ''
  }
);
const emit = defineEmits(['navigate']);

const store = useShopStore();
const product = ref<any>(null);
const loading = ref(true);
const selectedSpec = ref('');

const loadProductDetail = async () => {
  if (!props.productId) return;
  
  try {
    const docRef = doc(db, 'products', props.productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      product.value = {
        id: docSnap.id,
        ...docSnap.data()
      };
      if (product.value.specs && product.value.specs.length > 0) {
        selectedSpec.value = product.value.specs[0];
      }
    } else {
      console.error('找不到該商品');
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleAddToCart = async () => {
  if (!product.value) return;
  await store.addToCart(product.value, selectedSpec.value, 1);
  emit('navigate', 'cart');
};

onMounted(() => {
  loadProductDetail();
});
</script>

<template>
  <div class="container main-content" v-if="!loading && product">
    <div class="detail-container">
      <div class="detail-left">
        <img :src="product.imageUrl" :alt="product.title" class="detail-img">
      </div>
      
      <div class="detail-right">
        <h1 class="detail-title">{{ product.title }}</h1>
        <div class="detail-price">NT${{ product.price }}</div>
        
        <div class="detail-spec-section" v-if="product.specs && product.specs.length > 0">
          <label class="spec-label">規格</label>
          <div class="spec-options">
            <button
              v-for="spec in product.specs"
              :key="spec"
              class="spec-btn"
              :class="{ active: selectedSpec === spec }"
              @click="selectedSpec = spec"
            >
              {{ spec }}
            </button>
          </div>
        </div>
        
        <div class="detail-desc-section" v-if="product.description">
          <h3 class="desc-title">商品詳情</h3>
          <p class="desc-content">{{ product.description }}</p>
        </div>
        
        <div class="detail-actions">
          <button class="pink-btn-rect text-bold" @click="handleAddToCart">
            加入購物車
          </button>
          <button class="secondary-btn-rect text-bold" @click="emit('navigate', 'home')">
            返回首頁
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="container main-content text-center" v-else-if="loading">
    <p>商品詳情載入中...</p>
  </div>
  
  <div class="container main-content text-center" v-else>
    <p>找不到該商品資訊。</p>
    <button class="pink-btn-rect" @click="emit('navigate', 'home')">返回首頁</button>
  </div>
</template>