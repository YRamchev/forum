<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <PostList :posts="posts"/>
  </div>
</template>

<script>
import sourceData from '@/data'
import PostList from '@/components/PostList'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    PostList
  },

  data () {
    return {
      thread: sourceData.threads[this.id],
      users: sourceData.users
    }
  },

  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(sourceData.posts)
        .filter(post => postIds.includes(post['.key']))
    }
  }
}
</script>

<style>

</style>
