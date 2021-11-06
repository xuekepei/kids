import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   meta: {
  //     publicPage: false,
  //     adminType: "0",
  //   },
  //   component: () => import(/* webpackChunkName: "word" */ '../views/kids/Index.vue')
  // },
  {
    path: "/",
    name: "Word",
    meta: {
      publicPage: false,
      adminType: "1",
    },
    component: () => import(/* webpackChunkName: "learn" */ '../views/kids/learn/Word/WordDetail.vue')
  },
  {
    path: "/add",
    name: "Add",
    meta: {
      publicPage: false,
      adminType: "1",
    },
    component: () => import(/* webpackChunkName: "learn" */ '../views/kids/admin/add/Add.vue')
  },
  {   path: "/:pathMatch(.*)*", redirect: "/"},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
