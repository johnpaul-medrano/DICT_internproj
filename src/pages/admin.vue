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
            <option value="RD">RD</option>
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
  methods: {
    async createUser() {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Store additional user data in Firestore
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

        // Inform user of successful account creation
        alert("User created successfully!");
      } catch (error) {
        // Handle errors
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped src="./admin.css"></style>
