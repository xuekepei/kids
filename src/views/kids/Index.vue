<template>
    <sidebar-menu :menu="menuData" />
    <router-view/>
</template>
<script>
import { computed } from '@vue/reactivity';
export default {
    setup() {
        const menuData = computed(() =>{
            const newMenuData = [];
            newMenuData.push({
                href:"/learn",
                title:"Word"
            });
            newMenuData.push({
                herf:"/",
                title:"Admin",
            });
            return newMenuData
        });
        
        return {
            menuData
        };
    },
}
</script>
<style scoped>

</style>