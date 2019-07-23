<template>
  <div class="forum-list">
    <h2 class="list-title">
      <a href="category.html">Forums</a>
    </h2>
    <ForumListItem
      v-for="forum in forums" 
      :key="forum['.key']"
      :forum="forum"
    />
  </div>
</template>

<script>
import ForumListItem from './ForumListItem'

export default {
  components: {
    ForumListItem
  },

  props: {
    forums: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>
