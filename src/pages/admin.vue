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
          createdAt: new Date(),
        });

        // Clear form fields and error message
        this.email = "";
        this.username = "";
        this.password = "";
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
