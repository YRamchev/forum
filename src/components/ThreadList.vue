<template>
  <div class="thread-list">
    <h2 class="list-title">Threads</h2>

    <ThreadListItem 
      v-for="thread in threads" 
      :key="thread['.key']" 
      :thread="thread"
    />
  </div>
</template>

<script>
import ThreadListItem from './ThreadListItem'

export default {
  components: {
    ThreadListItem
  },

  props: {
    threads: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>
