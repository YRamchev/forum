<template>
  <div v-if="post && user" class="post">
    <div class="user-info">
      <a href class="user-name">{{user.name}}</a>
      <a href>
        <img :src="user.avatar" alt class="avatar-large" />
      </a>
      <p class="desktop-only text-small">{{userThreadsCount}} threads</p>
      <p class="desktop-only text-small">{{userPostsCount}} posts</p>
    </div>
    <div class="post-content">
      <template v-if="!editing">
        <div>{{ post.text}}</div>
        <a
          @click.prevent="editing = true"
          href="#"
          style="margin-left: 20px;"
          class="link-unstyled"
          title="Make a change"
        >
          <i class="fa fa-pencil"></i>
        </a>
      </template>

      <div class="col-full" v-else>
        <PostEditor :post="post" @save="editing = false" @cancel="editing = false" />
      </div>
    </div>
    <div class="post-date text-faded">
      <div class="editor-info" v-if="post.edited">edited</div>
      <AppDate :timestamp="post.publishedAt" />
    </div>
  </div>
</template>

<script>
import PostEditor from './PostEditor'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      editing: false
    }
  },

  components: {
    PostEditor
  },

  computed: {
    user () {
      return this.$store.state.users.items[this.post.userId]
    },

    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.post.userId)
    },

    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.post.userId)
    }
  }
}
</script>

<style>
</style>
