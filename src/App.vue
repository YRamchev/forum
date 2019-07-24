<template>
  <div id="app">
    <TheNavbar/>
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
export default {
  components: {
    TheNavbar
  }
}
</script>
