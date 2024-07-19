<template>
  <div class="main">
    <div id="box">
      <h2>PROJECTS</h2>
      <div id="projs">
        <RouterLink :to="{ name: 'MainPage', params: { logo: 'workforce' } }">
          <img :src="workforce" alt="Workforce" />
        </RouterLink>
        <RouterLink :to="{ name: 'MainPage', params: { logo: 'spark' } }">
          <img :src="spark" alt="Spark" />
        </RouterLink>
        <RouterLink :to="{ name: 'MainPage', params: { logo: 'tech4ed' } }">
          <img :src="tech4ed" alt="Tech4Ed" />
        </RouterLink>
      </div>
      <button id="button-signout" @click="showModal = true">
        <Icon icon="material-symbols:logout" width="25" />SIGN OUT
      </button>
    </div>
    <SignOutModal
      :isVisible="showModal"
      @close="showModal = false"
      @confirm="signOut"
    />
  </div>
</template>

<script>
import workforce from "@/assets/workforce.png";
import spark from "@/assets/spark.png";
import tech4ed from "@/assets/tech4ed.png";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { logout } from "@/firebaseConfig";
import { useRouter } from "vue-router";
import SignOutModal from "@/components/signoutconfirm.vue";

export default {
  name: "Projects",
  components: {
    Icon,
    SignOutModal,
  },
  data() {
    return {
      workforce,
      spark,
      tech4ed,
    };
  },
  setup() {
    const router = useRouter();
    const showModal = ref(false);

    router.replace({ path: '/projects' });

    async function signOut() {
      await logout();
      router.push("/");
      showModal.value = false;
    }

    return {
      showModal,
      signOut,
    };
  },
};
</script>

<style scoped src="./projects.css"></style>
