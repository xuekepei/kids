import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "Word",
    component: () => import(/* webpackChunkName: "word" */ '../views/Word/WordDetail.vue')
  },
  {   path: "/:pathMatch(.*)*", redirect: "/"},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
