<template>
<div v-if="asyncDataStatus_ready" class="col-full">
  <div class="col-full push-top">
    <!-- <ul class="breadcrumbs">
      <li><a href="/index.html"><i class="fa fa-home fa-btn"></i>Home</a></li>
      <li><a href="/category.html">Discussions</a></li>
      <li class="active"><a href="#">Cooking</a></li>
    </ul> -->

    <div class="forum-header">
      <div class="forum-details">
        <h1 class="text-left">{{forum.name}}</h1>
        <p class="text-lead">{{forum.description}}</p>
      </div>
      <router-link :to="{name: 'ThreadCreate', params: { forumId: this.forum['.key']}}" class="btn-green btn-small">Start a thread</router-link>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads"/>
  </div>
</div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {mapActions} from 'vuex'

export default {
  components: {
    ThreadList
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  mixins: [asyncDataStatus],

  computed: {
    forum () {
      return this.$store.state.forums[this.id]
    },

    threads () {
      return Object.values(this.$store.state.threads)
        .filter(thread => thread.forumId === this.id)
    }
  },

  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUser'])
  },

  created () {
    this.fetchForum({id: this.id})
      .then(forum => this.fetchThreads({ids: forum.threads}))
      .then(threads => Promise.all(threads.map(thread => this.fetchUser({id: thread.userId}))))
      .then(() => {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
      })
  }
}
</script>

<style>

</style>
