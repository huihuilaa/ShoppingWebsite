<script setup>
import { ref, onMounted } from 'vue';
import { getAllProductsService, addProductService, deleteProductService } from '../api/products';

const products = ref([]);
const title = ref('');
const price = ref(0);
const description = ref('');
const image = ref('');

const loadProducts = async () => {
  try {
    products.value = await getAllProductsService();
  } catch (error) {
    console.error('後台商品載入失敗:', error);
  }
};

const handleAddProduct = async () => {
  if (!title.value || price.value <= 0) return;
  try {
    await addProductService({
      title: title.value,
      price: Number(price.value),
      description: description.value,
      image: image.value || '/images/logo.png'
    });
    title.value = '';
    price.value = 0;
    description.value = '';
    image.value = '';
    await loadProducts();
    alert('商品上架成功！');
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteProduct = async (id) => {
  if (!confirm('確定要刪除此商品嗎？')) return;
  try {
    await deleteProductService(id);
    await loadProducts();
  } catch (error) {
    console.error(error);
  }
};

onMounted(loadProducts);
</script>

<template>
  <div class="admin-container">
    <h2>管理員後台面板</h2>
    ...
  </div>
</template>