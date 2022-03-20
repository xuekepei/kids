import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: "/",
        component: ()=> import(/* webpackChunkName: "Admin" */ '../views/kids/Index.vue'),
        children: [
            {
                path: "/learn",
                component: ()=> import(/* webpackChunkName: "learn" */ '../views/kids/learn/Word/Learn.vue')
            },
            {
                path: "/test",
                component: ()=> import(/* webpackChunkName: "learn" */ '../views/kids/learn/Word/WordDetail.vue')
            },
            {
                path: "/add",
                component: ()=> import(/* webpackChunkName: "learn" */ '../views/kids/admin/add/Add.vue')
            },
            {
                path: "/manage",
                component: ()=> import(/* webpackChunkName: "manage" */ '../views/kids/admin/manage/Manage.vue')
            }
        ]
    },
    {
        path: "/:pathMatch(.*)*", redirect: "/"
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
