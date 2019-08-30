<template>
  <div class="flex-grid justify-center">
    <div class="col-2">

      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            id="name" 
            v-model="form.name" 
            type="text" 
            class="form-input"
            @blur="$v.form.name.$touch()"
          >
          <template v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="form-error">
              This field is required
            </span>
          </template>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username" 
            v-model.lazy="form.username" 
            type="text" 
            class="form-input"
            @blur="$v.form.username.$touch()"
          >
          <template v-if="$v.form.username.$error">
            <span v-if="!$v.form.username.required" class="form-error">
              This field is required
            </span>
            <span v-if="!$v.form.username.unique" class="form-error">
              Username exists
            </span>
          </template>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model.lazy="form.email" 
            type="email" 
            class="form-input"
            @blur="$v.form.email.$touch()"
          >
          <template v-if="$v.form.email.$error">
            <span v-if="!$v.form.email.required" class="form-error">
              This field is required
            </span>
            <span v-elseif="!$v.form.email.email" class="form-error">
              You should type email address
            </span>
            <span v-elseif="!$v.form.email.unique" class="form-error">
              Email already exists
            </span>
          </template>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="form.password" 
            type="password" 
            class="form-input"
            @blur="$v.form.password.$touch()"  
          >
          <template v-if="$v.form.password.$error">
            <span v-if="!$v.form.password.required" class="form-error">
              Password is required
            </span>
            <span v-if="!$v.form.password.minLength" class="form-error">
              Password should be atleast 6 symbols
            </span>
          </template>
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input 
            id="avatar" 
            v-model.lazy="form.avatar" 
            type="text" 
            class="form-input"
            @blur="$v.form.avatar.$touch()"
          >
          <template v-if="$v.form.avatar.$error">
            <span v-if="!$v.form.avatar.url" class="form-error">
              Bad url
            </span>
            <span v-if="!$v.form.avatar.supportedImageFile" class="form-error">
              Filetype not supported
            </span>
            <span v-if="!$v.form.avatar.responseOk" class="form-error">
              Bad url
            </span>
          </template>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>

      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click="registerWithGoogle"><i class="fa fa-google fa-btn"></i>Sign up with Google</button>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, email, url } from 'vuelidate/lib/validators'
import {uniqueEmail, uniqueUsername, supportedImageFile, responseOk }
export default {
  data () {
    return {
      form: {
        name: null,
        username: null,
        email: null,
        password: null,
        avatar: null
      }
    }
  },

  validations: {
    form: {
      name: {
        required
      },
      username: {
        required,
        uniqueUsername 
      },
      email: {
        required,
        email,
        uniqueEmail
      },
      password: {
        required,
        minLength: minLength(6)
      },
      avatar: {
        url,
        supportedImageFile,
        responseOk
      }
    }
  },

  methods: {
    register () {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return
      }
      this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
      .then(() => {
        this.$router.push('/')
      })
    },

    registerWithGoogle () {
      this.$store.dispatch('auth/signInWithGoogle')
        .then(() => {
          this.$router.push('/')
        })
    }
  },

  created () {
    this.$emit('ready')
  }
}
</script>

<style>

</style>
