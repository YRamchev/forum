<template>
<div class="col-full push-top" v-if="asyncDataStatus_ready">
  <h1>Welcome to the forum</h1>

  <CategoryList :categories="categories"/>
</div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import {mapActions} from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: {
    CategoryList
  },

  mixins: [asyncDataStatus],

  computed: {
    categories () {
      return Object.values(this.$store.state.categories.items)
    }
  },

  methods: {
    ...mapActions('categories', ['fetchAllCategories']),
    ...mapActions('forums', ['fetchForums'])
  },

  created () {
    this.fetchAllCategories()
      .then(categories => Promise.all(categories.map(category => this.fetchForums({ids: Object.keys(category.forums)}))))
      .then(() => {
        this.asyncDataStatus_fetched()
      })
  }
}
</script>

<style>
  
</style>