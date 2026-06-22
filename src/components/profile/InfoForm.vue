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

<style scoped>
.tab-pane-view { }
.info-form-layout { padding: 20px 10px; }
.form-fields-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 520px;
}
.form-input-group-row { display: flex; align-items: center; }
.form-input-label {
  width: 100px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #334155;
  text-align: right;
  padding-right: 30px;
}
.form-clean-input {
  flex: 1;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  padding: 10px 16px;
  font-size: 1.05rem;
  border-radius: 4px;
  color: #334155;
  outline: none;
}
.form-action-btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 60px;
}
.btn-submit-profile {
  background-color: #ff66a3;
  color: #ffffff;
  border: none;
  padding: 12px 40px;
  font-size: 1.15rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 102, 163, 0.2);
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.btn-submit-profile:hover {
  background-color: #ff4d94;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 163, 0.3);
}
.btn-submit-profile:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 102, 163, 0.2);
}
.btn-profile-logout {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 12px 40px;
  font-size: 1.15rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.btn-profile-logout:hover {
  background-color: #f8fafc;
  color: #ff66a3;
  border-color: #ff66a3;
}
</style>