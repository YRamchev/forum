<template>
  <div>
    <CategoryListItem 
      v-for="category in categories" 
      :key="category['.key']" 
      :category="category"/>
  </div>
</template>

<script>
import CategoryListItem from '@/components/CategoryListItem'

export default {
  props: {
    categories: {
      type: Object,
      required: true
    }
  },

  components: {
    CategoryListItem
  }
}
</script>

<style>

</style>
