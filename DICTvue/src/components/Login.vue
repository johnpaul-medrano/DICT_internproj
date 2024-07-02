<template>
  <div class="login-page">

    <div class="login-container">
      <h1>DICT DOCTRACKER</h1>
      <div class="Login-box">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="text" id="username" v-model="username" placeholder="Username" required />
        </div>
        <div class="form-group">
          <input type="password" id="password" v-model="password" placeholder="Password" required />
        </div>
        <button type="submit">LOGIN</button>
      </form>
    </div>
    </div>

    <div class="logo-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    handleLogin() {
      if (this.username === 'admin' && this.password === 'password') {
        alert('Login successful!');
        this.$router.push('/Projects');
      } else {
        alert('Invalid username or password');
      }
    },
  },
};
</script>

<style src="./Login.css"></style>
