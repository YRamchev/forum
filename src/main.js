import Vue from 'vue'
import App from './App'
import router from './router'
import AppDate from '@/components/AppDate'
import store from '@/store'
import firebase from 'firebase/app'
import vuelidate from 'vuelidate'
Vue.use(vuelidate)

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_ID,
  appId: process.env.FIREBASE_APP_ID
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

Vue.config.productionTip = false

// global components
Vue.component('AppDate', AppDate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },

  beforeCreate () {
    store.dispatch('users/fetchUser', {id: store.state.authId})
  }
})
