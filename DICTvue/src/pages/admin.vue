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
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      error: null,
      auth: null, // Initialize auth as null
      db: null, // Initialize db as null
    };
  },
  created() {
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
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  },
  methods: {
    async createUser() {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Store additional user data in Firestore
        await setDoc(doc(this.db, "users", user.uid), {
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
