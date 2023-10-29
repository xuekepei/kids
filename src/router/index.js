import {createRouter, createWebHistory} from 'vue-router'
import store from '../store'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/kids/Index.vue'),
        children: [
            {
                path: '/learn',
                name: 'Learn',
                component: () => import('../views/kids/learn/Word/Learn.vue')
            },
            {
                path: '/test',
                name: 'Test',
                component: () => import('../views/kids/learn/Word/WordDetail.vue')
            },
            {
                path: '/sentence',
                name: 'Sentence',
                component: () => import('../views/kids/learn/Sentence/Sentence.vue')
            }
        ]
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/admin/Index.vue'),
        children: [
            {
                path: '/admin/word',
                name: 'AdminWord',
                component: () => import('../views/admin/Word/WordList.vue'),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/sentence',
                name: 'AdminSentence',
                component: () => import('../views/admin/Sentence/SentenceList.vue'),
                meta: {
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/records',
        name: 'RecordHome',
        component: () => import('../views/records/Index.vue'),
        children: [
            {
                path: '/record',
                name: 'Record',
                component: () => import('../views/records/Record.vue'),
                meta: {
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue')
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
        next({path: '/login'})
    } else {
        next()
    }
})

export default router
