<!-- src/views/Projects.vue -->
<template>
  <div class="main">
    <div id="box">
      <h2>PROJECTS</h2>
      <div id="projs">
        <img :src="workforce" alt="Workforce" />
        <img :src="spark" alt="Spark" />
        <img :src="tech4ed" alt="Tech4Ed" />
      </div>
    </div>
  </div>
</template>

<script>
import workforce from "@/assets/workforce.png";
import spark from "@/assets/spark.png";
import tech4ed from "@/assets/tech4ed.png";

export default {
  name: "Projects",
  data() {
    return {
      workforce,
      spark,
      tech4ed,
    };
  },
};
</script>

<style scoped src="./projects.css"></style>
