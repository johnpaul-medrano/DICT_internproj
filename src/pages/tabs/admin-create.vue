<template>
  <div id="main">
    <div class="admin">
      <h1>Create User Account</h1>
      <form @submit.prevent="createUser">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <div>
          <label for="role">Role:</label>
          <select v-model="role" required>
            <option value="" disabled>Select role</option>
            <option value="ILCDB">ILCDB</option>
            <option value="TOD Head">TOD Head</option>
            <option value="Budget Division">Budget Division</option>
            <option value="RD">Regional Director</option>
            <option value="Supply Office">Supply Office</option>
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "vue3-toastify";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logout } from "@/firebaseConfig";
import "vue3-toastify/dist/index.css";
import SignOutModal from "@/components/signoutconfirm.vue";

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      role: "",
      error: null,
    };
  },
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
  methods: {
    validatePassword(password) {
      const errors = [];

      if (!/[A-Z]/.test(password)) {
        errors.push("• At least one uppercase letter");
      }
      if (!/\d/.test(password)) {
        errors.push("• At least one number");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("• At least one special character");
      }
      if (password.length < 8) {
        errors.push("• At least 8 characters long");
      }

      return errors.length > 0
        ? `Password must contain:\n\n${errors.join("\n")}`
        : null;
    },
    async createUser() {
      const passwordError = this.validatePassword(this.password);
      if (passwordError) {
        toast.error(passwordError, {
          position: "bottom-right",
          autoClose: 5000,
        });
        return;
      }

      const loadingToastId = toast.loading("Creating user account...", {
        position: "bottom-right",
        transition: "flip",
        hideProgressBar: true,
      });

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: this.email,
          username: this.username,
          role: this.role,
          createdAt: new Date(),
        });

        // Clear form fields and error message
        this.email = "";
        this.username = "";
        this.password = "";
        this.role = "";
        this.error = null;

        // Update the toast message to success
        toast.update(loadingToastId, {
          position: "bottom-right",
          render: "User created successfully!",
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
          isLoading: false,
        });
      } catch (error) {
        // Handle errors
        this.error = error.message;

        // Update the toast message to error
        toast.update(loadingToastId, {
          position: "bottom-right",
          render: `Error creating user: ${error.message}`,
          type: toast.TYPE.ERROR,
          autoClose: 2000,
          isLoading: false,
        });
      }
    },
  },
};
</script>

<style scoped src="./admin-create.css"></style>
