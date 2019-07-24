<template>
  <div class="col-full">
    <h1>{{ category.name }}</h1>
    <CategoryListItem 
      :category="category"
    />
  </div>
</template>

<script>
import CategoryListItem from '@/components/CategoryListItem'
import sourceData from '@/data'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    CategoryListItem
  },

  computed: {
    category () {
      return sourceData.categories[this.id]
    }
  }
}
</script>

<style>

</style>
