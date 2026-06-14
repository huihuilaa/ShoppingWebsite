import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. 引入 createPinia
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia() // 2. 建立 pinia 實例

app.use(pinia) // 3. 這一行一定要在 app.mount('#app') 之前呼叫！
app.mount('#app')