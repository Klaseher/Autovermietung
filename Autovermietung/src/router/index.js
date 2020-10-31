/* eslint-disable camelcase */
/* eslint-disable eqeqeq */

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import Register_Login from '@/components/Register_Login'
import UserBoard from '@/components/UserBoard'
import Admin from '@/components/Admin'
import EmployeeEdit from '@/components/EmployeeEdit'
import UserService from '../services/user.service'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },

    {
      path: '/login',
      name: 'login',
      component: Register_Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/dashboard',
      name: 'userboard',
      component: UserBoard,
      meta: {
        requiresAuth: true,
        is_user: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        requiresAuth: true,
        is_employee: true
      }
    },
    {
      path: '/admin/editEmployee/:id',
      name: 'editEmployee',
      component: EmployeeEdit,
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    },
    {
      path: '*',
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    UserService.getAuthentication().then(
      response => {
        sessionStorage.setItem('role', JSON.stringify(response.data.role))
        sessionStorage.setItem('auth', response.data.auth)

        if (JSON.stringify(response.data.auth) !== 'true') {
          next({
            path: '/login',
            params: { nextUrl: to.fullPath }
          })
        } else {
          let role = response.data.role
          if (to.matched.some(record => record.meta.is_employee)) {
            if (role >= 1) {
              next()
            } else if (role == 0) {
              next({name: 'userboard'})
            } else {
              next({name: 'login'})
            }
          } else if (to.matched.some(record => record.meta.is_admin)) {
            if (role == 2) {
              next()
            } else if (role == 1) {
              next({name: 'admin'})
            } else if (role == 0) {
              next({name: 'userboard'})
            } else {
              next({name: 'login'})
            }
          } else if (to.matched.some(record => record.meta.is_user)) {
            if (role == 0) {
              next()
            } else if (role >= 1) {
              next({name: 'admin'})
            } else {
              next({name: 'login'})
            }
          }
        }
      },
      error => {
        let content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        alert(content)
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('auth')
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        })
      }
    )
  } else if (to.matched.some(record => record.meta.guest)) {
    UserService.testToken().then(
      response => {
        if (response.data.role != null && response.data.auth != null) {
          sessionStorage.setItem('role', JSON.stringify(response.data.role))
          sessionStorage.setItem('auth', response.data.auth)

          if (JSON.stringify(response.data.auth) !== 'true') {
            next()
          } else {
            let role = response.data.role

            if (role == 0) {
              next({name: 'userboard'})
            } else if (role >= 1) {
              next({name: 'admin'})
            } else {
              next()
            }
          }
        } else {
          next()
        }
      },
      _error => {
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('auth')
        next()
      })
  } else {
    next()
  }
})

export default router
