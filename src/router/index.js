import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      publicPage: false,
      adminType: "0",
    },
    component: () => import(/* webpackChunkName: "Admin" */ '../views/kids/Index.vue')
  },
  {
    path: "/kids",
    name: "Kids",
    meta: {
      publicPage: false,
      adminType: "0",
    },
    component: () => import(/* webpackChunkName: "Admin" */ '../views/kids/Index.vue'),
    children:[
        {
            path: "/learn",
            name: "Learn",
            meta: {
              publicPage: false,
              adminType: "1",
            },
            component: () => import(/* webpackChunkName: "learn" */ '../views/kids/learn/Word/Learn.vue')
          },
          {
            path: "/test",
            name: "Test",
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
          }
    ]
  }
  ,
  {   path: "/:pathMatch(.*)*", redirect: "/"},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
