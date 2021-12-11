<template>
    <div class="kids-body-box">
        <div class="kids-body" :class="{collapsed:showMenu}">
            <div class="menu-bar">
                <n-space justify="space-between">
                    <n-button @click="onClickMenu"><n-icon><menu-outline></menu-outline></n-icon></n-button>
                    <div> </div>
                </n-space>
                <n-divider />
            </div>
            <router-view />
        </div>
        <div class="side-bar-menu">
            <sidebar-menu :collapsed="!showMenu" theme="white-theme" :width="'150px'" :widthCollapsed="'0px'" :menu="menuData" :hideToggle="true" @item-click="onSideBarItemClick" />
        </div>
        
    </div>
</template>
<script>
import { computed ,ref, onMounted} from 'vue';
import { NIcon , NDivider} from 'naive-ui'
import { MenuOutline} from '@vicons/ionicons5'
import { useRoute, useRouter } from "vue-router";

export default {
    components:{
		NIcon,
		MenuOutline,
        NDivider
	},
    setup() {

        const router = useRouter();
        const route = useRoute();
        const showMenu = ref(false);
        onMounted(()=>{ 
            router.replace({
                path: "/learn",
            })
        });
        const menuData = computed(() =>{
            const newMenuData = [];
            newMenuData.push({
                href:"/test",
                title:"Test"
            });
            newMenuData.push({
                href:"/learn",
                title:"Learn"
            });
            newMenuData.push({
                href:"/add",
                title:"Add"
            });
            newMenuData.push({
              href:"/manage",
              title:"Manage"
            });
            return newMenuData
        });

        const onSideBarItemClick = (e, i) => {
            onClickMenu()
        };

        const onClickMenu = () =>{
            showMenu.value = !showMenu.value
        };
        
        return {
            menuData,
            showMenu,
            onClickMenu,
            onSideBarItemClick
        };
    },
}
</script>
<style scoped>
.kids-body-box {
    height: 100%;
}
.kids-body {
    margin: auto;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    min-height: 100%;
    padding:0px 5px;
    transition: margin-left 0.5s;
}
.kids-body.collapsed {
    margin-left: 150px;
    transition: margin-left 0.5s;
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