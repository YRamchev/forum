<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1 class="text-left">
      {{ thread.title }}
      <router-link 
        :to="{name: 'ThreadEdit', id: this.id}"
        class="btn-green btn-small"
        tag="button"  
      >
        Edit Thread
      </router-link>
    </h1>
    
    <p class="text-left">
      By <a href="#" class="link-unstyled">{{ user.name }}</a>, <AppDate :timestamp="thread.publishedAt"/>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ repliesCount }} replies by {{contributorsCount}} contributors</span>
    </p>
    <PostList :posts="posts"/>

    <PostEditor
      v-if="authUser"
      :threadId="id"
    />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign In</router-link> or <router-link :to="{name: 'Register'}">Register</router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {countObjectProperties} from '@/utils'
import {mapActions, mapGetters} from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    PostList,
    PostEditor
  },

  mixins: [asyncDataStatus],

  computed: {

    ...mapGetters({
      authUser: 'auth/authUser'
    }),

    thread () {
      return this.$store.state.threads.items[this.id]
    },

    user () {
      return this.$store.state.users.items[this.thread.userId]
    },

    contributorsCount () {
      return countObjectProperties(this.thread.contributors)
    },

    repliesCount () {
      return this.$store.getters['threads/threadRepliesCount'](this.thread['.key'])
    },

    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(this.$store.state.posts.items)
        .filter(post => postIds.includes(post['.key']))
    }
  },

  methods: {
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('posts', ['fetchPosts']),
    ...mapActions('users', ['fetchUser'])
  },

  created () {
    // fetch thread
    this.fetchThread({id: this.id})
      .then(thread => {
        // fetch user
        this.fetchUser({id: thread.userId})
        return this.fetchPosts({ids: Object.keys(thread.posts)})
      })
      .then(posts => {
        return Promise.all(posts.map(post => {
          this.fetchUser({id: post.userId})
        }))
      })
      .then(() => {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
      })
  }
}
</script>

<style>

</style>
