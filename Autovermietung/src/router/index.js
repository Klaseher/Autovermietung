import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserBoard from '@/components/UserBoard'
import Admin from '@/components/Admin'
import NotFound from '@/components/Notfound'
import UserService from '../services/user.service';


Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
      {
          path: '/',
          name: 'HelloWorld',
          component: HelloWorld
      },
      {
          path: '/login',
          name: 'login',
          component: Login,
          meta: {
              guest: true
          }
      },
      {
          path: '/register',
          name: 'register',
          component: Register,
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
              is_admin : true
          }
      },
      {
      path: "*",
      component: NotFound
    }
  ]
})


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (sessionStorage.getItem('auth') != 'true') {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
        UserService.getAuthentication().then(
            response => {
              sessionStorage.setItem('role',JSON.stringify(response.data.role))  
              let role = response.data.role  
              if(role != null){
                if(to.matched.some(record => record.meta.is_admin)) {
                    if(role >= 1){
                        next()
                    }
                    else if(role == 0){
                        next({ name: 'userboard'})
                    } 
                  }    
                  else if(to.matched.some(record => record.meta.is_user)) {
                      if(role == 0){
                          next()
                      }
                      else if(role >= 1){
                          next({ name: 'admin'})
                      }     
                  }
              }
              else{
                next({ name: 'login'})
              }
            },
            error => {
                let content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
                alert(content)
                sessionStorage.removeItem('role')  
                sessionStorage.removeItem('auth')  
                next({ name: 'login'})
            }
        )
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(sessionStorage.getItem('auth') != 'true'){
          next()
      }
      else{
        UserService.getAuthentication().then(
            response => {
              sessionStorage.setItem('role',JSON.stringify(response.data.role))  
              let role = response.data.role  
              if(role != null){
                if(role == 0){
                    next({ name: 'userboard'})
                 }
                 else if(role >= 1){
                   next({ name: 'admin'})
                 }
              }
              else{
                next()
              }
            },
            error => {
                let content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
                alert(content)
                sessionStorage.removeItem('role')  
                sessionStorage.removeItem('auth')  
                next()
            }
        )
      }
  }else {
      next()
  }
})

export default router
