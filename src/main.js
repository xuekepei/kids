import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { create,NButton} from 'naive-ui'
const naive = create({
    components:[NButton]
})

createApp(App)
.use(store)
.use(router)
.use(naive)
.mount('#app')
