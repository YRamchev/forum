<template>
  <div class="col-large push-top">
    <h1 class="text-left">{{ thread.title }}</h1>
    <p class="text-left">
      By <a href="#" class="link-unstyled">Robin</a>, <AppDate :timestamp="thread.publishedAt"/>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">3 replies by 3 contributors</span>
    </p>
    <PostList :posts="posts"/>

    <PostEditor
      :threadId="id"
    />
  </div>
</template>

<script>
import sourceData from '@/data'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'

console.log(sourceData)
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

  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },

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
