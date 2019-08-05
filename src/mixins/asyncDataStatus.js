export default {
  data () {
    return {
      asyncDataStatus_ready: false
    }
  },

  methods: {
    asyncDataStatus_fetched () {
      this.$emit('ready')
      this.asyncDataStatus_ready = true
    }
  }
}
