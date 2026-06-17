<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useShopStore } from '../store/shop';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const props = defineProps<{ productId: string }>();

const emit = defineEmits<{
  (e: 'navigate', view: string): void
}>();

const store = useShopStore();
const product = ref<any>(null);
const selectedSpec = ref('');
const selectedQuantity = ref(1);

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
        selectedSpec.value = product.value.specs[0] || '';
      }
    } else {
      console.error('找不到該商品');
    }
  } catch (error) {
    console.error(error);
  }
};

const addToCart = async () => {
  if (product.value) {
    await store.addToCart(product.value, selectedSpec.value, selectedQuantity.value);
    alert('已成功加入購物車！');
  }
};

const buyNow = async () => {
  if (product.value) {
    await store.addToCart(product.value, selectedSpec.value, selectedQuantity.value);
    emit('navigate', 'cart');
  }
};

onMounted(() => {
  loadProductDetail();
});
</script>

<template>
  <div class="container" v-if="product">
    <div class="detail-layout">
      <div class="detail-img-wrap">
        <img :src="product.imageUrl" :alt="product.title">
      </div>
      
      <div class="detail-info">
        <h1 class="detail-title">
          {{ product.title }} <span class="detail-alias" v-if="product.alias">{{ product.alias }}</span>
        </h1>
        
        <div class="info-row-group">
          <div class="info-row">
            <span class="info-label">價錢：</span>
            <span class="detail-price">NT${{ product.price }}</span>
          </div>
          
          <div class="info-row" v-if="product.specs && product.specs.length > 0">
            <span class="info-label">規格：</span>
            <select v-model="selectedSpec" class="detail-select">
              <option v-for="spec in product.specs" :key="spec" :value="spec">{{ spec }}</option>
            </select>
          </div>

          <div class="info-row">
            <span class="info-label">數量：</span>
            <select v-model="selectedQuantity" class="detail-select quantity-select">
              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>
        
        <div class="action-group">
          <button class="btn-add-cart" @click="addToCart">加入購物車</button>
          <button class="btn-buy-now" @click="buyNow">立即購買</button>
        </div>
      </div>
    </div>

    <div class="product-info-section">
      <div class="section-title">
        <span class="blue-sq">■</span>商品資訊 <span class="en">PRODUCT INFO</span>
      </div>
      
      <div class="info-content-box custom-info-box">
        <div class="content-row" v-if="product.bookingPeriod">
          <span class="content-label">預購期間：</span>
          <p class="content-text custom-text-style">{{ product.bookingPeriod }}</p>
        </div>

        <div class="content-row" v-if="product.releaseDate">
          <span class="content-label">發售日期：</span>
          <p class="content-text custom-text-style">{{ product.releaseDate }}</p>
        </div>

        <div class="content-row" v-if="product.shippingDate">
          <span class="content-label">商品配送：</span>
          <p class="content-text custom-text-style pre-line-style">{{ product.shippingDate }}</p>
        </div>

        <div class="content-row" v-if="product.contentDesc">
          <span class="content-label">商品內容：</span>
          <p class="content-text custom-text-style">{{ product.contentDesc }}</p>
        </div>

        <div class="content-row" v-if="product.sizeMaterial">
          <span class="content-label">商品規格：</span>
          <p class="content-text custom-text-style pre-line-style">{{ product.sizeMaterial }}</p>
        </div>
      </div>
    </div>
  </div>
</template>