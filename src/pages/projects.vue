<!-- src/views/Projects.vue -->
<template>
  <div class="main">
    <div id="box">
      <h2>PROJECTS</h2>
      <div id="projs">
        <RouterLink :to="{ name:'MainPage', params: { logo: 'workforce'} }">
          <img :src="workforce" alt="Workforce" />
        </RouterLink>
        <RouterLink :to="{ name:'MainPage', params: { logo: 'spark'} }">
          <img :src="spark" alt="Spark" />
        </RouterLink>
        <RouterLink :to="{ name:'MainPage', params: { logo: 'tech4ed'} }">
          <img :src="tech4ed" alt="Tech4Ed" />
        </RouterLink>
        <button @click="signOut">Sign out</button>
      </div>
    </div>
  </div>
</template>

<script>
import workforce from "@/assets/workforce.png";
import spark from "@/assets/spark.png";
import tech4ed from "@/assets/tech4ed.png";
import { RouterLink } from "vue-router";
import { logout } from "@/firebaseConfig";
import { useRouter } from "vue-router";


export default {
  name: "Projects",
  data() {
    return {
      workforce,
      spark,
      tech4ed,
    };
  },
  setup() {
    const router = useRouter();
    
    async function signOut() {
      await logout();
      router.push('/');
    }

    return {
      signOut,
    };
  },
};
</script>

<style scoped src="./projects.css"></style>
