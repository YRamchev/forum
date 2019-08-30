import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/PageHome'
import ThreadShow from '@/pages/PageThreadShow'
import ThreadCreate from '@/pages/PageThreadCreate'
import ThreadEdit from '@/pages/PageThreadEdit'
import PageForum from '@/pages/PageForum'
import PageCategory from '@/pages/PageCategory'
import PageProfile from '@/pages/PageProfile'
import PageNotFound from '@/pages/PageNotFound'
import Register from '@/pages/PageRegister'
import SignIn from '@/pages/PageSignIn'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/category/:id',
      name: 'PageCategory',
      component: PageCategory,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'PageForum',
      component: PageForum,
      props: true
    },
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'PageProfile',
      component: PageProfile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/edit',
      name: 'PageProfileEdit',
      component: PageProfile,
      props: {edit: true},
      meta: { requiresAuth: true }
    },
    {
      path: '/logout',
      name: 'SignOut',
      meta: { requiresAuth: true },
      beforeEnter (to, from, next) {
        store.dispatch('signOut')
          .then(() => next({name: 'Home'}))
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: PageNotFound
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  store.dispatch('auth/initAuthentication')
    .then(user => {
      if (to.matched.some(route => route.meta.requiresAuth)) {
        if (user) {
          next()
        } else {
          next({name: 'SignIn', query: {redirectTo: to.path}})
        }
      } else {
        next()
      }
    })
})

export default router
