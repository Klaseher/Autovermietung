// Hier kommt die ganze Routing-Logik der Webseiten rein wie Sicherung bestimmter Ressourcen

// Hier immer neue Vue-Methode importieren, damit Routing-Logik festgelegt werden kann
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// Hier kommen die Wege zur jeweiligen Ressource und die dabei zu ladende Vue-Komponente rein
let router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})

// Methode wird bei jedem Ressourcenwechsel ausgeführt
router.beforeEach((to, from, next) => {

})

export default router
