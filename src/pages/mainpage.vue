<template>
  <div class="main">
    <div class="left">
      <sidebar />
    </div>
    <div class="container">
      <router-view class="main-content"></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/sidebar.vue";

export default {
  components: {
    Sidebar,
  },
};
</script>

<style scoped>
.main {
  display: flex;
  height: 100vh;
  background-color: #d9d9d9;
  overflow-y: auto;
}

.container {
  flex: 0.8;
  height: 100vh;
  overflow-y: auto;
}

.left {
  flex: 0.2;
}
</style>
