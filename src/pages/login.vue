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
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { saveMessagingDeviceToken } from "@/messaging";

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
        console.log("uid: ", userCredential.user.uid);
        this.errorMessage = "";

        // Fetch user role and username from Firestore
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role;
          const username = userData.username;

          toast.update(loaderToastId, {
            render: `Welcome ${userRole}: ${username}`,
            type: toast.TYPE.SUCCESS,
            autoClose: 2000,
            isLoading: false,
          });

          // Save role and username to local storage or state
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("username", username);

          // Redirect based on role
          this.redirectUser(userRole);

          saveMessagingDeviceToken(userCredential.user.uid);
          // window.history.pushState(null, "", "/projects");
        } else {
          toast.update(loaderToastId, {
            render: "User role not found",
            type: toast.TYPE.ERROR,
            autoClose: 2000,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error logging in:", error);
        toast.update(loaderToastId, {
          render: "Account does not exist",
          type: toast.TYPE.ERROR,
          autoClose: 2000,
          isLoading: false,
        });
      }
    },
    redirectUser(role) {
      switch (role) {
        case "ILCDB":
        case "TOD Head":
        case "Budget Division":
        case "RD":
        case "Supply Office":
          this.$router.push({ path: "/projects" });
          break;
        case "Admin":
          this.$router.push({ path: "/admin"});
          break;
        default:
          this.$router.push({ path: "/" });
      }
    },
  },
};
</script>

<style scoped src="./login.css"></style>
