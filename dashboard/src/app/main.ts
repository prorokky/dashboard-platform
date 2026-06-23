import { createApp } from 'vue'
import 'platform-ui/styles/index.css'

import App from './App.vue'
import { dashboardPinia } from '../stores/pinia.ts'

const app = createApp(App)

app.use(dashboardPinia)
app.mount('#app')
