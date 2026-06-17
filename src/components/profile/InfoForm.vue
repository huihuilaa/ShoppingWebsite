<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  initialEmail: string;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'logout'): void;
}>();

const profileForm = ref({
  name: '',
  email: props.initialEmail,
  address: '',
  phone: ''
});

watch(() => props.initialEmail, (newEmail) => {
  profileForm.value.email = newEmail;
});
</script>

<template>
  <div class="tab-pane-view info-form-layout">
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
      <button class="btn-profile-logout" @click="emit('logout')">
        登出
      </button>
      <button class="pink-btn-rect text-bold btn-submit-profile" @click="emit('save')">
        儲存
      </button>
    </div>
  </div>
</template>