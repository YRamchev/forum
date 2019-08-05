<template>
  <div class="col-full">
    <h1>
      Not Found
    </h1>
    <p>
      Ooooops, we couldn't find what you are looking for. Why dont you go home instead?
      <router-link :to="{name: 'Home'}">
        Go to homepage.
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  created () {
    this.$emit('ready')
  }
}
</script>

<style>

</style>
