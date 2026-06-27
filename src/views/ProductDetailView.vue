<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useShopStore } from '../store/shop';
import { getProductByIdService } from '../api/products';

const route = useRoute();
const router = useRouter();
const store = useShopStore();

const product = ref(null);
const loading = ref(true);
const error = ref(false);
const selectedSpec = ref('');
const quantity = ref(1);

const localImages = import.meta.glob('@/assets/images/*', { 
  eager: true, 
  query: '?url', 
  import: 'default' 
});

const getLocalImage = (dbPath) => {
  if (!dbPath) return '';
  const filename = dbPath.split('/').pop() || '';
  const matchedKey = Object.keys(localImages).find(key => key.endsWith(filename));
  return matchedKey ? localImages[matchedKey] : dbPath;
};

onMounted(async () => {
  try {
    const data = await getProductByIdService(route.params.id);
    product.value = data;
    if (data.specs?.length > 0) {
      selectedSpec.value = data.specs[0];
    }
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});

const addToCart = async () => {
  if (!store.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  await store.addToCart(product.value, selectedSpec.value || '標準款', quantity.value);
};

const buyNow = async () => {
  if (!store.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  await store.addToCart(product.value, selectedSpec.value || '標準款', quantity.value);
  router.push('/cart');
};
</script>

<template>
  <div v-if="loading" class="loading-state">
    <p>商品詳細資訊載入中...</p>
  </div>

  <div v-else-if="error" class="error-state">
    <h2>404</h2>
    <p>找不到此商品，可能已下架或網址錯誤。</p>
    <RouterLink to="/" class="back-home-btn">返回首頁</RouterLink>
  </div>

  <div v-else-if="product" class="container">
    <div class="detail-layout">
      <div class="detail-img-wrap">
        <img :src="getLocalImage(product.imageUrl)" :alt="product.title">
      </div>
      <div class="detail-info">
        <h1 class="detail-title">
          {{ product.title }}
          <span class="detail-alias" v-if="product.alias">{{ product.alias }}</span>
        </h1>

        <div class="info-row-group">
          <div class="detail-info__row">
            <span class="info-label">價錢：</span>
            <span class="detail-price">NT${{ product.price }}</span>
          </div>

          <div class="detail-info__row" v-if="product.specs?.length > 0">
            <span class="info-label">規格：</span>
            <div class="spec-buttons-wrap">
              <button
                v-for="spec in product.specs"
                :key="spec"
                class="spec-btn"
                :class="{ active: selectedSpec === spec }"
                @click="selectedSpec = spec"
              >{{ spec }}</button>
            </div>
          </div>

          <div class="detail-info__row">
            <span class="info-label">數量：</span>
            <div class="qty-box">
              <button @click="quantity > 1 && quantity--" :disabled="quantity <= 1">-</button>
              <span class="qty-num">{{ quantity }}</span>
              <button @click="quantity < 10 && quantity++" :disabled="quantity >= 10">+</button>
            </div>
          </div>
        </div>

        <div class="action-group">
          <button class="btn-add-cart" @click="addToCart">加入購物車</button>
          <button class="btn-buy-now" @click="buyNow">立即購買</button>
        </div>
      </div>
    </div>

    <div class="product-info-section" v-if="product.contentDesc || product.bookingPeriod || product.releaseDate || product.shippingDate || product.sizeMaterial">
      <div class="section-title">
        <span class="blue-sq">■</span>商品資訊 <span class="en">PRODUCT INFO</span>
      </div>
      <div class="info-box">
        <div class="info-row" v-if="product.bookingPeriod">
          <span class="info-label">預購期間：</span>
          <p>{{ product.bookingPeriod }}</p>
        </div>
        <div class="info-row" v-if="product.releaseDate">
          <span class="info-label">發售日期：</span>
          <p>{{ product.releaseDate }}</p>
        </div>
        <div class="info-row" v-if="product.shippingDate">
          <span class="info-label">商品配送：</span>
          <p style="white-space: pre-line">{{ product.shippingDate }}</p>
        </div>
        <div class="info-row" v-if="product.contentDesc">
          <span class="info-label">商品內容：</span>
          <p>{{ product.contentDesc }}</p>
        </div>
        <div class="info-row" v-if="product.sizeMaterial">
          <span class="info-label">商品規格：</span>
          <p style="white-space: pre-line">{{ product.sizeMaterial }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-state, .error-state {
  text-align: center;
  padding: 80px 20px;
  color: #767676;
}
.back-home-btn {
  display: inline-block;
  margin-top: 20px;
  color: #5ea6e4;
  text-decoration: underline;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 60px;
  padding: 60px 0;
}
.detail-img-wrap {
  width: 100%;
  max-width: 450px;
  aspect-ratio: 1 / 1;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  overflow: hidden;
}
.detail-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

.detail-info { display: flex; flex-direction: column; justify-content: center; }
.detail-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 30px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.detail-alias { font-size: 1.4rem; color: #8293a5; font-weight: 500; }
.detail-price { font-size: 1.35rem; color: #ff66a3; font-weight: bold; }

.info-row-group { display: flex; flex-direction: column; gap: 0; }
.detail-info__row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.info-label {
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  margin-right: 8px;
}

.spec-buttons-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
.spec-btn {
  background-color: #f0f6fc;
  border: 1px solid #5ea6e4;
  color: #5ea6e4;
  font-size: 0.95rem;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}
.spec-btn:hover { background-color: #e1eefc; }
.spec-btn.active { background-color: #ff66a3; border-color: #ff66a3; color: #ffffff; }

.qty-box {
  display: inline-flex;
  align-items: center;
  border: 1px solid #5ea6e4;
  border-radius: 4px;
  overflow: hidden;
  height: 32px;
}
.qty-box button {
  background: #fff;
  border: none;
  color: #5ea6e4;
  font-size: 1.1rem;
  font-weight: bold;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qty-box button:hover:not(:disabled) { background-color: #f0f6fc; }
.qty-box button:disabled { color: #cbd5e1; cursor: not-allowed; }
.qty-num {
  width: 36px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: bold;
  color: #1a1a1a;
  border-left: 1px solid #5ea6e4;
  border-right: 1px solid #5ea6e4;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-group { display: flex; gap: 15px; margin-top: 35px; }
.btn-add-cart {
  background-color: #ffffff;
  border: 1px solid #5ea6e4;
  color: #5ea6e4;
  font-weight: bold;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-add-cart:hover { background-color: #f0f6fc; }
.btn-buy-now {
  background-color: #ff66a3;
  border: 1px solid #ff66a3;
  color: #ffffff;
  font-weight: bold;
  border-radius: 4px;
  padding: 10px 35px;
  font-size: 0.95rem;
  cursor: pointer;
}
.btn-buy-now:hover { opacity: 0.9; }

.product-info-section { padding: 40px 0 100px; max-width: 900px; margin: 0 auto; }
.section-title {
  font-size: 1.35rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
}
.info-box { display: flex; flex-direction: column; gap: 20px; }
.info-row { display: flex; align-items: flex-start; }
.info-row p { margin: 0; font-size: 1.1rem; color: #2c3e50; line-height: 1.6; }
</style>