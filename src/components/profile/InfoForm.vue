<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  initialEmail: string;
  initialName?: string;
  initialAddress?: string;
  initialPhone?: string;
}>();

const emit = defineEmits<{
  (e: 'save', data: { name: string; email: string; address: string; phone: string }): void;
  (e: 'logout'): void;
}>();

const profileForm = ref({
  name: props.initialName || '',
  email: props.initialEmail,
  address: props.initialAddress || '',
  phone: props.initialPhone || ''
});

watch(() => props.initialEmail, (newEmail) => {
  profileForm.value.email = newEmail;
});

watch(() => props.initialName, (v) => { if (v !== undefined) profileForm.value.name = v; });
watch(() => props.initialAddress, (v) => { if (v !== undefined) profileForm.value.address = v; });
watch(() => props.initialPhone, (v) => { if (v !== undefined) profileForm.value.phone = v; });
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
      <button class="pink-btn-rect text-bold btn-submit-profile" @click="emit('save', profileForm)">
        儲存
      </button>
    </div>
  </div>
</template>