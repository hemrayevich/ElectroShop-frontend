import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)

app.use(router)

// Initialize authentication from storage / refresh profile
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
