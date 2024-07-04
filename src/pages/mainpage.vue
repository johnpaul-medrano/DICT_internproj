<template>
  <div class="main">
    <sidebar />
    <div class="main-content">
      <prform />
    </div>
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import prform from "./tabs/prform.vue";

export default {
  components: {
    sidebar,
    prform,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}
</style>
