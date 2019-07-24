<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea 
        name="" 
        id="" 
        cols="30" 
        class="form-input"
        rows="10" 
        v-model="text"
      ></textarea>
    </div>
    <div class="form-action">
      <button class="btn-blue">
        Submit Form
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    threadId: {
      required: true
    }
  },

  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const postId = 'greatPost' + Math.random()

      const post = {
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.threadId,
        userId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3',
        '.key': postId
      }

      this.text = ''

      this.$emit('save', {post})
    }
  }
}
</script>

<style>

</style>
