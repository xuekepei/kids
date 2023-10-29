<template>
    <div class="kids-body-box">
        <div class="kids-body" :class="{collapsed:showMenu && isMobile}">
            <div class="menu-bar">
                <n-space justify="space-between">
                    <n-button @click="onClickMenu">
                        <n-icon>
                            <menu-outline/>
                        </n-icon>
                    </n-button>
                    <div></div>
                </n-space>
                <n-divider/>
            </div>
            <router-view/>
        </div>
        <div class="side-bar-menu">
            <sidebar-menu :collapsed="!showMenu" theme="white-theme" :width="'150px'" :widthCollapsed="'0px'"
                          :menu="menuData" :hideToggle="true" @item-click="onSideBarItemClick"/>
        </div>

    </div>
</template>
<script>
import {computed, onMounted, ref} from 'vue'
import {NDivider, NIcon, useMessage} from 'naive-ui'
import {MenuOutline} from '@vicons/ionicons5'
import {useRoute, useRouter} from 'vue-router'

export default {
    components: {
        NIcon,
        MenuOutline,
        NDivider
    },
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'index',
    setup() {

        window.$message = useMessage()

        const route = useRoute()
        const router = useRouter()
        const showMenu = ref(false)
        onMounted(async () => {
            await router.isReady()
            if (route.path === '/') {
                await router.replace({
                    path: '/record',
                })
            }
        })
        const isMobile = computed(() => {
            return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)

        })
        const menuData = computed(() => {
            const newMenuData = []
            newMenuData.push({
                href: '/record',
                title: 'Record'
            })
            return newMenuData
        })

        const onSideBarItemClick = () => {
            // eslint-disable-line no-unused-vars
            onClickMenu()
        }

        const onClickMenu = () => {
            showMenu.value = !showMenu.value
        }

        return {
            menuData,
            showMenu,
            isMobile,
            onClickMenu,
            onSideBarItemClick
        }
    },
}
</script>
<style scoped>
.kids-body-box {
    height: 100%;
}

.kids-body {
    margin: auto;
    max-width: 500px;
    padding: 0 5px;
    transition: margin-left 0.3s;
}

.kids-body.collapsed {
    margin-left: 150px;
}

.menu-bar {
    padding: 10px 20px;
    max-height: 80px;
}

.side-bar-menu {
    margin-left: -1em;
    margin-right: -1em;
}
</style>

<style>
.v-sidebar-menu {
    border-right: 1px solid #dee2e6;
}

.vsm_collapsed .vsm--item {
    opacity: 0;
}
</style>