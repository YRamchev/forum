<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>{{ category.name }}</h1>
    <CategoryListItem 
      :category="category"
    />
  </div>
</template>

<script>
import CategoryListItem from '@/components/CategoryListItem'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {mapActions} from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  mixins: [asyncDataStatus],

  components: {
    CategoryListItem
  },

  computed: {
    category () {
      return this.$store.state.categories[this.id]
    }
  },

  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },

  created () {
    this.fetchCategory({id: this.id})
      .then(category => {
        this.fetchForums({ids: category.forums})
      })
      .then(() => {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
      })
  }
}
</script>

<style>

</style>
