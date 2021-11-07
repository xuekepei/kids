import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSideBarMenu from 'vue-sidebar-menu'
import { create,NButton} from 'naive-ui'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

const naive = create({
    components:[NButton]
})

createApp(App)
.use(store)
.use(router)
.use(VueSideBarMenu)
.use(naive)
.mount('#app')
