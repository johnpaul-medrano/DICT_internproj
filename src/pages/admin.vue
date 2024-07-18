<template>
  <div class="main">
    <div class="left">
      <sidebar />
    </div>

    <div class="container">
      <ulo />
      <router-view class="main-content"></router-view>
    </div>
  </div>
</template>

<script>
import ulo from "@/components/Ulo.vue";
import Sidebar from "@/components/sidebar.vue";

export default {
  components: {
    Sidebar,
    ulo,
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
  overflow-y: auto;
  scrollbar-width: none;
  margin-top: 80px;
}

.container::-webkit-scrollbar {
  display: none;
}

.left {
  flex: 0.2;
}
</style>
