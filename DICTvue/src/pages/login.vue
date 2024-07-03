<!-- src/views/Login.vue -->
<template>
  <div id="main">
    <div id="left">
      <h1>ILCDB PROCUREMENT AND <br />MONITORING SYSTEM</h1>
      <div id="box">
        <h2>Welcome!</h2>
        <form @submit.prevent="login">
          <div>
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Password"
            />
          </div>
          <button type="submit">
            <Icon icon="material-symbols:login" width="25" />
            Log-in
          </button>
        </form>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
    </div>
    <img :src="logo" alt="DICT Logo" class="logo" />
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import logo from "@/assets/Logo.png";

export default {
  name: "Login",
  components: {
    Icon,
  },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      logo,
    };
  },
  methods: {
    login() {
      console.log("Logging in with:", this.username, this.password);
    },
  },
};
</script>

<style scoped src="./Login.css"></style>
