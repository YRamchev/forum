<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready">

    <h1>Create new thread in <i>{{forum.name}}</i></h1>

    <ThreadEditor 
      ref="editor"
      @save="save"  
      @cancel="cancel"
    />
  </div>  
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {mapActions} from 'vuex'

export default {
  props: {
    forumId: {
      type: String,
      required: true
    }
  },

  components: {
    ThreadEditor
  },

  mixins: [asyncDataStatus],

  data () {
    return {
      saved: false
    }
  },

  computed: {
    forum () {
      return this.$store.state.forums.items[this.forumId]
    },

    hasUnsaved () {
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved
    }
  },
  methods: {

    ...mapActions('threads', ['createThread']),
    ...mapActions('forums', ['fetchForum']),

    save ({title, text}) {
      this.createThread({
        title,
        text,
        forumId: this.forum['.key']
      }).then(thread => {
        this.saved = true
        this.$router.push({name: 'ThreadShow', params: {id: thread['.key']}})
      })
    },

    cancel () {
      this.$router.push({name: 'PageForum', params: {id: this.forum['.key']}})
    }
  },

  created () {
    this.fetchForum({id: this.forumId})
      .then(() => {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
      })
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasUnsaved) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost.')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style>

</style>
