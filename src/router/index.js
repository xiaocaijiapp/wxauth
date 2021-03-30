import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: ()=> import('../views/index')
  },
  {
    path: '/success',
    name: 'Success',
    component: ()=> import('../views/bindsuccess')
  },
  {
    path: '/failure',
    name: 'Failure',
    component: ()=> import('../views/bindfailure')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
