<template>
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
  </template>
  
  <script>
  import { auth, db } from '../firebaseConfig';
  import './admin.css'; // Import the CSS file
  
  export default {
    data() {
      return {
        email: '',
        username: '',
        password: '',
        error: null
      };
    },
    methods: {
      async createUser() {
        try {
          const userCredential = await auth.createUserWithEmailAndPassword(this.email, this.password);
          const user = userCredential.user;
          await db.collection('users').doc(user.uid).set({
            email: this.email,
            username: this.username,
            createdAt: new Date()
          });
          this.email = '';
          this.username = '';
          this.password = '';
          this.error = null;
          alert('User created successfully!');
        } catch (error) {
          this.error = error.message;
        }
      }
    }
    
  };
  </script>