<template>
    <div class="kids-body-box">
        <div class="kids-body" :class="{ collapsed:showMenu }">
            <div class="side-bar-menu">
                <sidebar-menu :collapsed="!showMenu" theme="white-theme" :width="'150px'" :widthCollapsed="'0px'"
                              :menu="menuData" :hideToggle="true" @item-click="onSideBarItemClick"/>
            </div>
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
    </div>
</template>
<script>
import { computed, onMounted, ref } from 'vue'
import { NDivider, NIcon, useMessage } from 'naive-ui'
import { MenuOutline } from '@vicons/ionicons5'
import { useRoute, useRouter } from 'vue-router'

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
        const showMenu = ref(true)
        onMounted(async () => {
            await router.isReady()
            if (route.path === '/') {
                await router.replace({
                    path: '/learn',
                })
            }
        })
        const menuData = computed(() => {
            const newMenuData = []
            newMenuData.push({
                href: '/manage',
                title: 'Manage'
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
    margin-left: 0;
    padding: 0 5px;
    transition: margin-left 0.3s;
}

.kids-body.collapsed {
    margin-left: 150px;
    /*transition: margin-left 0.25s;*/
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