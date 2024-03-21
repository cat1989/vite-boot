import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const container = document.createElement("div")
document.body.appendChild(container)

createApp(App).use(router).mount(container)
