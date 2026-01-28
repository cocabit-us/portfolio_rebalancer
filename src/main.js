import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const pinia = createPinia()
const vuetify = createVuetify()

createApp(App).use(pinia).use(vuetify).mount('#app')
