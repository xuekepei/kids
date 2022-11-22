import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/kids/Index.vue'),
        children: [
            {
                path: '/learn',
                component: () => import('../views/kids/learn/Word/Learn.vue')
            },
            {
                path: '/test',
                component: () => import('../views/kids/learn/Word/WordDetail.vue')
            }
        ]
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/admin/Index.vue'),
        children: [
            {
                path: '/word',
                component: () => import('../views/admin/Word/WordList.vue'),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/sentence',
                component: () => import('../views/admin/Sentence/SentenceList.vue'),
                meta: {
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import('../views/kids/User/Login.vue')
    },
    {
        path: '/:pathMatch(.*)*', redirect: '/'
    },
    {
        path: '/admin/:pathMatch(.*)*', redirect: '/word'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = store.state.token
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !token) {
        next({ path: '/login' })
    } else {
        next()
    }
})

export default router
