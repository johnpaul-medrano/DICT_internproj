<template>
  <div id="main">
    <div id="left">
      <h1>ILCDB PROCUREMENT AND <br />MONITORING SYSTEM</h1>
      <div id="box">
        <h2>Welcome!</h2>

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
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import logo from "@/assets/logo.png";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const toastId = ref("");

export default {
  name: "Login",
  components: {
    Icon,
  },
  setup() {
    toast.info("Please Login to the System", {
      position: "top-center",
      transition: "flip",
      hideProgressBar: true,
      autoClose: 500,
    });
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      logo,
    };
  },
  methods: {
    async login() {
      const loaderToastId = toast.loading("Logging in...", {
        position: "top-center",
        transition: "flip",
        hideProgressBar: true,
      });
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        console.log("Logged in user:", userCredential.user);
        this.errorMessage = ""; // Clear any previous error messages

        toast.update(loaderToastId, {
          render: "Login successful",
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
          isLoading: false,
        });

        this.$router.push({ path: "/projects" });
      } catch (error) {
        console.error("Error logging in:", error); // Log the error to the console
        toast.update(loaderToastId, {
          render: "Account does not exist",
          type: toast.TYPE.ERROR,
          autoClose: 2000,
          isLoading: false,
        });
      }
    },
  },
};
</script>

<style scoped src="./login.css"></style>
