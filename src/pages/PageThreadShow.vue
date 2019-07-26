<template>
  <div class="col-large push-top">
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
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{ repliesCount }} replies by 3 {{contributorsCount}}</span>
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

    user () {
      return this.$store.state.users[this.thread.userId]
    },

    contributorsCount () {
      const replies = Object.keys(this.thread.posts)
        .filter(postId => postId !== this.thread.firstPostId)
        .map(postId => this.$store.state.posts[postId])

      const UserIds = replies.map(post => post.postId)

      return UserIds.filter((item, index) => UserIds.indexOf(item) === index).length
    },

    repliesCount () {
      return this.$store.getters.threadRepliesCount(this.thread['.key'])
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
