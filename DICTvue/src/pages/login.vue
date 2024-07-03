<template>
  <div id="main">
    <div id="left">
      <h1>ILCDB PROCUREMENT AND <br />MONITORING SYSTEM</h1>
      <div id="box">
        <marquee behavior="" direction="right"><h2>Welcome!</h2></marquee>

        <form @submit.prevent="login">
          <div>
            <input type="text" id="email" v-model="email" placeholder="Email" />
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
import logo from "@/assets/logo.png";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
    async login() {
      const firebaseConfig = {
        apiKey: "AIzaSyB49eQ4TrCod9HyTAcNJqCFido3Sb9WPHI",
        authDomain: "dictapp-21983.firebaseapp.com",
        projectId: "dictapp-21983",
        storageBucket: "dictapp-21983.appspot.com",
        messagingSenderId: "672180765503",
        appId: "1:672180765503:web:de6516c6516a13707b498a",
        measurementId: "G-RQJ0PNMW5D",
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.username,
          this.password
        );
        console.log("Logged in user:", userCredential.user);
        this.errorMessage = ""; // Clear any previous error messages

        // Redirect to Projects.vue (assuming it's a route named 'projects')
        this.$router.push({ path: "/mainpage" });
      } catch (error) {
        console.error("Error logging in:", error); // Log the error to the console
        this.errorMessage = error.message;
      }
    },
  },
};
</script>

<style scoped src="./login.css"></style>
