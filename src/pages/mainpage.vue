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
import ulo from "../components/Ulo.vue";
import Sidebar from "../components/sidebar.vue";
import { mapActions } from "vuex";

export default {
  components: {
    Sidebar,
    ulo,
  },
  props: ["logo"],
  created() {
    this.updateLogo(this.$route.params.logo);
  },
  watch: {
    $route(to, from) {
      this.updateLogo(to.params.logo);
    },
  },
  methods: {
    ...mapActions(["updateLogo"]),
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
  margin-top: 100px;
}

.container::-webkit-scrollbar {
  display: none;
}

.left {
  flex: 0.2;
}
</style>
