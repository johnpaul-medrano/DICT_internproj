<template>
  <header class="header">
    <div id="invidiv"></div>
    <div class="title-logo-container">
      <h1 class="title">ILCDB</h1>
      <img src="@/assets/logo.png" alt="Settings Icon" />
    </div>

    <button id="signout" @click="showModal = true">
      <Icon icon="material-symbols:logout" width="20" /> Sign-out
    </button>

    <SignOutModal
      :isVisible="showModal"
      @close="showModal = false"
      @confirm="signOut"
    />
  </header>
</template>

<script>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { logout } from "@/firebaseConfig";
import SignOutModal from "@/components/signoutconfirm.vue";

export default {
  components: {
    Icon,
    SignOutModal,
  },

  setup() {
    const router = useRouter();
    const showModal = ref(false);

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

<style scoped src="./Ulo.css"></style>
